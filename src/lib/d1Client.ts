// The scraping jobs (src/jobs/*.ts) run from GitHub Actions as plain Node
// scripts, not inside a Worker - so there's no D1 binding available (bindings
// only exist at runtime inside a Worker/Pages Function). Cloudflare's D1 REST
// API is the equivalent for out-of-Worker callers.
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export const d1Query = async (
  sql: string,
  params: unknown[] = []
): Promise<any[]> => {
  if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) {
    throw new Error(
      'Missing CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_D1_DATABASE_ID / CLOUDFLARE_API_TOKEN'
    );
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  const body: any = await res.json();
  if (!body.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(body.errors)}`);
  }
  return body.result[0]?.results ?? [];
};

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

// Mirrors the Mongoose `Model.findOneAndUpdate(query, doc, { upsert: true })`
// pattern the jobs used to rely on: insert `data` into `table`, or update the
// existing row in place if `conflictColumns` already match one.
export const d1Upsert = async (
  table: string,
  conflictColumns: string[],
  data: Record<string, unknown>
): Promise<void> => {
  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  const columns = Object.keys(row);
  const placeholders = columns.map(() => '?').join(', ');
  const updateSet = columns
    .filter((c) => c !== 'id' && c !== 'createdAt' && !conflictColumns.includes(c))
    .map((c) => `${c} = excluded.${c}`)
    .join(', ');

  const sql = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT(${conflictColumns.join(', ')}) DO UPDATE SET ${updateSet}
  `;
  const params = columns.map((c) => {
    const v = row[c];
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (Array.isArray(v)) return JSON.stringify(v);
    return v ?? null;
  });
  await d1Query(sql, params);
};
