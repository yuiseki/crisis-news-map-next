// Bulk-loads the JSONL dumps written by dump_mongo.mjs into D1 via the REST
// API, in batched multi-row INSERTs. Resumable: writes a `.progress` file
// with the last completed line number per collection, and skips already-done
// lines on restart (so an interrupted run - or a rate limit - just picks up
// where it left off instead of re-inserting from zero).
import fs from "fs";
import readline from "readline";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const BACKUP_DIR = "/home/yuiseki/mongo-backups/crisis-news-map-next";
const BATCH_SIZE = 400;

const esc = (v) => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replace(/'/g, "''")}'`;
};

const toIso = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.$date) return new Date(v.$date).toISOString();
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toISOString();
};

const oid = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
};

const d1Query = async (sql) => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    }
  );
  const body = await res.json();
  if (!body.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(body.errors)}`);
  }
  return body;
};

const progressPath = (name) => `${BACKUP_DIR}/${name}.progress`;

const loadProgress = (name) => {
  try {
    return parseInt(fs.readFileSync(progressPath(name), "utf-8").trim(), 10);
  } catch {
    return 0;
  }
};

const saveProgress = (name, lineNo) => {
  fs.writeFileSync(progressPath(name), String(lineNo));
};

const NEWS_COLUMNS = [
  "id", "createdAt", "updatedAt", "url", "domain", "title", "ogTitle",
  "ogDesc", "ogImage", "ogUrl", "sourceType", "sourceName", "sourceConfirmed",
  "factConfirmed", "fakeConfirmed", "category", "tags", "placeCountry",
  "placePref", "placeCity", "placeRiver", "placeMountain", "placeStation",
  "placeAirport", "placePolice", "latitude", "longitude",
];

const toNewsRow = (doc) => ({
  id: oid(doc._id),
  createdAt: toIso(doc.createdAt),
  updatedAt: toIso(doc.updatedAt),
  url: doc.url,
  domain: doc.domain,
  title: doc.title,
  ogTitle: doc.ogTitle,
  ogDesc: doc.ogDesc,
  ogImage: doc.ogImage,
  ogUrl: doc.ogUrl,
  sourceType: doc.sourceType,
  sourceName: doc.sourceName,
  sourceConfirmed: !!doc.sourceConfirmed,
  factConfirmed: !!doc.factConfirmed,
  fakeConfirmed: !!doc.fakeConfirmed,
  category: doc.category,
  tags: doc.tags ? JSON.stringify(doc.tags) : null,
  placeCountry: doc.placeCountry,
  placePref: doc.placePref,
  placeCity: doc.placeCity,
  placeRiver: doc.placeRiver,
  placeMountain: doc.placeMountain,
  placeStation: doc.placeStation,
  placeAirport: doc.placeAirport,
  placePolice: doc.placePolice,
  latitude: doc.latitude ?? null,
  longitude: doc.longitude ?? null,
});

const RIVER_COLUMNS = [
  "id", "createdAt", "updatedAt", "code", "name", "point", "level",
  "townCode", "prefCode", "over", "startLevel", "warnLevel", "fladLevel",
  "isFlood", "category", "obsTime", "observedAt", "placeCountry",
  "placePref", "placeRiver", "latitude", "longitude",
];

const toRiverRow = (doc) => ({
  id: oid(doc._id),
  createdAt: toIso(doc.createdAt),
  updatedAt: toIso(doc.updatedAt),
  code: doc.code,
  name: doc.name,
  point: doc.point ?? null,
  level: doc.level ?? null,
  townCode: doc.townCode,
  prefCode: doc.prefCode,
  over: doc.over ?? null,
  startLevel: doc.startLevel ?? null,
  warnLevel: doc.warnLevel ?? null,
  fladLevel: doc.fladLevel ?? null,
  isFlood: !!doc.isFlood,
  category: doc.category,
  obsTime: doc.obsTime,
  observedAt: toIso(doc.observedAt),
  placeCountry: doc.placeCountry,
  placePref: doc.placePref,
  placeRiver: doc.placeRiver,
  latitude: doc.latitude ?? null,
  longitude: doc.longitude ?? null,
});

const DISPATCH_COLUMNS = [
  "id", "createdAt", "updatedAt", "originId", "category", "unit", "detail",
  "division", "status", "time_str", "observedAt", "placeCountry",
  "placePref", "placeCity", "latitude", "longitude",
];

const toDispatchRow = (doc) => ({
  id: oid(doc._id),
  createdAt: toIso(doc.createdAt),
  updatedAt: toIso(doc.updatedAt),
  originId: doc.originId,
  category: doc.category,
  unit: doc.unit,
  detail: doc.detail,
  division: doc.division,
  status: doc.status,
  time_str: doc.time_str,
  observedAt: toIso(doc.observedAt),
  placeCountry: doc.placeCountry,
  placePref: doc.placePref,
  placeCity: doc.placeCity,
  latitude: doc.latitude ?? null,
  longitude: doc.longitude ?? null,
});

const WEATHER_COLUMNS = [
  "id", "createdAt", "updatedAt", "originId", "title", "content",
  "warnLevel", "observedAt", "placeCountry", "placePref", "latitude",
  "longitude",
];

const toWeatherRow = (doc) => ({
  id: oid(doc._id),
  createdAt: toIso(doc.createdAt),
  updatedAt: toIso(doc.updatedAt),
  originId: doc.originId,
  title: doc.title,
  content: doc.content,
  warnLevel: doc.warnLevel ?? null,
  observedAt: toIso(doc.observedAt),
  placeCountry: doc.placeCountry,
  placePref: doc.placePref,
  latitude: doc.latitude ?? null,
  longitude: doc.longitude ?? null,
});

const COLLECTIONS = [
  { name: "news", table: "news", columns: NEWS_COLUMNS, toRow: toNewsRow },
  { name: "riverlevels", table: "river_levels", columns: RIVER_COLUMNS, toRow: toRiverRow },
  { name: "dispatches", table: "dispatches", columns: DISPATCH_COLUMNS, toRow: toDispatchRow },
  { name: "weatheralerts", table: "weather_alerts", columns: WEATHER_COLUMNS, toRow: toWeatherRow },
];

const importCollection = async ({ name, table, columns, toRow }) => {
  const filePath = `${BACKUP_DIR}/${name}.jsonl`;
  if (!fs.existsSync(filePath)) {
    console.log(`skip ${name}: ${filePath} not found`);
    return;
  }
  const startLine = loadProgress(name);
  console.log(`${name}: resuming from line ${startLine}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  let lineNo = 0;
  let batch = [];
  let inserted = 0;

  const flush = async () => {
    if (batch.length === 0) return;
    const values = batch
      .map((row) => `(${columns.map((c) => esc(row[c])).join(", ")})`)
      .join(",\n");
    const sql = `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES\n${values};`;
    await d1Query(sql);
    inserted += batch.length;
    saveProgress(name, lineNo);
    batch = [];
  };

  for await (const line of rl) {
    lineNo++;
    if (lineNo <= startLine) continue;
    if (!line.trim()) continue;
    const doc = JSON.parse(line);
    batch.push(toRow(doc));
    if (batch.length >= BATCH_SIZE) {
      await flush();
      if (inserted % 20000 < BATCH_SIZE) {
        console.log(`${name}: ${inserted} rows imported (line ${lineNo})...`);
      }
    }
  }
  await flush();
  console.log(`${name}: DONE, ${inserted} rows imported this run`);
};

const main = async () => {
  if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) {
    throw new Error(
      "Missing CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_D1_DATABASE_ID / CLOUDFLARE_API_TOKEN"
    );
  }
  for (const col of COLLECTIONS) {
    await importCollection(col);
  }
  console.log("All collections imported.");
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
