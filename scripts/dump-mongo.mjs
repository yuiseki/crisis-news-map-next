import pkg from "mongodb";
const { MongoClient } = pkg;
import fs from "fs";

const env = fs.readFileSync(
  "/tmp/claude-1000/-Workspaces/7ef25711-c47f-458f-9a3f-2ae5b85c3ac6/scratchpad/vercel-migration/crisis-news-map-next/.env.local",
  "utf-8"
);
const uri = env.match(/^MONGODB_URI="?([^"\n]+)"?/m)?.[1];
const user = env.match(/^MONGODB_USER="?([^"\n]+)"?/m)?.[1];
const pass = env.match(/^MONGODB_PASS="?([^"\n]+)"?/m)?.[1];
const dbname = env.match(/^MONGODB_DB="?([^"\n]+)"?/m)?.[1];

const OUT_DIR = "/home/yuiseki/mongo-backups/crisis-news-map-next";

const client = new MongoClient(uri, { auth: { username: user, password: pass } });
await client.connect();
const db = client.db(dbname);

const collections = ["news", "riverlevels", "dispatches", "weatheralerts"];

for (const colName of collections) {
  const outPath = `${OUT_DIR}/${colName}.jsonl`;
  const stream = fs.createWriteStream(outPath);
  const cursor = db.collection(colName).find({}, { batchSize: 2000 });
  let count = 0;
  console.time(colName);
  for await (const doc of cursor) {
    stream.write(JSON.stringify(doc) + "\n");
    count++;
    if (count % 100000 === 0) {
      console.log(`${colName}: ${count} docs...`);
    }
  }
  stream.end();
  console.timeEnd(colName);
  console.log(`${colName}: DONE, ${count} docs written to ${outPath}`);
}

await client.close();
