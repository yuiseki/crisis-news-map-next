// One-time precompute of the vaccine.csv -> geocoded JSON that
// pages/api/vaccine.ts used to compute on every request via fs.readFileSync +
// Detector (which itself reads local JSON files). Both are unavailable in
// Workers, and the source CSV is static historical COVID-19 data that never
// changes, so there's no reason to redo this work per-request - precompute
// once and ship the result as a bundled JSON asset instead.
//
// Usage: npx tsx scripts/precompute-vaccine.ts
import fs from 'fs';
import path from 'path';
import csvParseSync from 'csv-parse/lib/sync';
import { Detector } from '../src/lib/detector';

const main = async () => {
  const json = [];
  const filePath = path.resolve('./src/data/yuiseki.net/covid19/vaccine.csv');
  const fileData = fs.readFileSync(filePath);
  const rows = csvParseSync(fileData);
  for await (const row of rows) {
    if (row[0] === '都道府県コード') {
      continue;
    }
    if (row[0].length === 0) {
      continue;
    }
    const detector = new Detector(row[1]);
    await detector.ready;
    const rowData = {
      pref: row[1],
      people: row[5],
      finished: row[2],
      percentage: Number(row[7].replace('%', '')),
      latitude: detector.location.lat,
      longitude: detector.location.long,
    };
    json.push(rowData);
  }
  const outPath = path.resolve('./src/data/precomputed/vaccine.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`Wrote ${json.length} rows to ${outPath}`);
};

main();
