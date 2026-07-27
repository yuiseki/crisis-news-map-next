// Bulk-loads the JSONL dumps written by dump-mongo.mjs into the self-hosted
// Postgres (k8s) via `pg`, in large batched multi-row INSERTs with
// parameterized values. Resumable via per-collection `.pgprogress` files.
import fs from "fs";
import readline from "readline";
import pg from "pg";

const { Pool } = pg;

const BACKUP_DIR = "/home/yuiseki/mongo-backups/crisis-news-map-next";
const BATCH_SIZE = 2000;

// A handful of source documents have pathologically large text fields (a
// scraper apparently captured full page content into ogDesc/content instead
// of just the meta description in some cases). Cap defensively.
const MAX_STRING_LEN = 20000;
const clamp = (v) => {
  if (typeof v !== "string") return v;
  return v.length > MAX_STRING_LEN ? v.slice(0, MAX_STRING_LEN) : v;
};

const toIso = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.$date) return new Date(v.$date).toISOString();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const oid = (v) => {
  if (!v) return null;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
};

const progressPath = (name) => `${BACKUP_DIR}/${name}.pgprogress`;

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
  url: clamp(doc.url),
  domain: clamp(doc.domain),
  title: clamp(doc.title),
  ogTitle: clamp(doc.ogTitle),
  ogDesc: clamp(doc.ogDesc),
  ogImage: clamp(doc.ogImage),
  ogUrl: clamp(doc.ogUrl),
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
  detail: clamp(doc.detail),
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
  title: clamp(doc.title),
  content: clamp(doc.content),
  warnLevel: doc.warnLevel ?? null,
  observedAt: toIso(doc.observedAt),
  placeCountry: doc.placeCountry,
  placePref: doc.placePref,
  latitude: doc.latitude ?? null,
  longitude: doc.longitude ?? null,
});

const COLLECTIONS = [
  { name: "news", table: "news", columns: NEWS_COLUMNS, toRow: toNewsRow, conflictCol: "id" },
  { name: "riverlevels", table: "river_levels", columns: RIVER_COLUMNS, toRow: toRiverRow, conflictCol: "id" },
  { name: "dispatches", table: "dispatches", columns: DISPATCH_COLUMNS, toRow: toDispatchRow, conflictCol: "id" },
  { name: "weatheralerts", table: "weather_alerts", columns: WEATHER_COLUMNS, toRow: toWeatherRow, conflictCol: "id" },
];

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER || "crisis",
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || "crisis_news",
});

const importCollection = async ({ name, table, columns, toRow, conflictCol }) => {
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

  const insertRows = async (rows) => {
    if (rows.length === 0) return;
    const params = [];
    const valueGroups = rows.map((row) => {
      const placeholders = columns.map((c) => {
        params.push(row[c]);
        return `$${params.length}`;
      });
      return `(${placeholders.join(", ")})`;
    });
    const quotedCols = columns.map((c) => `"${c}"`).join(", ");
    const sql = `INSERT INTO ${table} (${quotedCols}) VALUES ${valueGroups.join(", ")} ON CONFLICT DO NOTHING;`;
    await pool.query(sql, params);
  };

  const flush = async () => {
    if (batch.length === 0) return;
    await insertRows(batch);
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
      if (inserted % 50000 < BATCH_SIZE) {
        console.log(`${name}: ${inserted} rows imported (line ${lineNo})...`);
      }
    }
  }
  await flush();
  console.log(`${name}: DONE, ${inserted} rows imported this run`);
};

const main = async () => {
  for (const col of COLLECTIONS) {
    await importCollection(col);
  }
  console.log("All collections imported.");
  await pool.end();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
