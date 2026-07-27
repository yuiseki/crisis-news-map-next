import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = getDb();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { rows } = await db.query(
    `SELECT * FROM weather_alerts WHERE "updatedAt" > $1 ORDER BY "updatedAt" DESC LIMIT 200`,
    [yesterday]
  );
  res.status(200).json(rows);
};

export default handler;
