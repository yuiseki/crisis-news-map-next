import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import csvParseSync from 'csv-parse/lib/sync';
import { Detector } from '~/lib/detector';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
      percentage: new Number(row[7].replace('%', '')),
      latitude: detector.location.lat,
      longitude: detector.location.long,
    };
    json.push(rowData);
  }
  res.status(200).json(json);
};

export default handler;
