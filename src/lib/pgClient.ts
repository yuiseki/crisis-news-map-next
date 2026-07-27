// Used by the scraping jobs (src/jobs/*.ts, src/lib/crawl.ts) and by the k8s
// CronJob that runs them - plain Node processes with a direct TCP connection
// to the in-cluster Postgres (never exposed to the internet).
import { getDb } from '~/lib/db';

const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

// Mirrors the Mongoose `Model.findOneAndUpdate(query, doc, { upsert: true })`
// pattern the jobs used to rely on: insert `data` into `table`, or update the
// existing row in place if `conflictColumns` already match one.
export const pgUpsert = async (
  table: string,
  conflictColumns: string[],
  data: Record<string, unknown>,
  // Upstream scrape sources sometimes include extra fields the table
  // doesn't have a column for (e.g. a "qt" quality flag from one river
  // API). Without a whitelist those leak into the INSERT and fail with
  // "column does not exist" - restrict to known columns when provided.
  allowedColumns?: string[]
): Promise<void> => {
  const now = new Date().toISOString();
  let row: Record<string, unknown> = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };
  if (allowedColumns) {
    const allowed = new Set(['id', 'createdAt', 'updatedAt', ...allowedColumns]);
    row = Object.fromEntries(
      Object.entries(row).filter(([k]) => allowed.has(k))
    );
  }
  const columns = Object.keys(row);
  const params = columns.map((c) => {
    const v = row[c];
    if (v instanceof Date) return v.toISOString();
    if (Array.isArray(v)) return JSON.stringify(v);
    return v ?? null;
  });
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const quotedColumns = columns.map((c) => `"${c}"`).join(', ');
  const updateSet = columns
    .filter((c) => c !== 'id' && c !== 'createdAt' && !conflictColumns.includes(c))
    .map((c) => `"${c}" = excluded."${c}"`)
    .join(', ');
  const quotedConflict = conflictColumns.map((c) => `"${c}"`).join(', ');

  const sql = `
    INSERT INTO ${table} (${quotedColumns})
    VALUES (${placeholders})
    ON CONFLICT (${quotedConflict}) DO UPDATE SET ${updateSet}
  `;
  await getDb().query(sql, params);
};
