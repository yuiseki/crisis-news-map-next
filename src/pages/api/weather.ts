import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDb();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { results } = await db
    .prepare(
      `SELECT * FROM weather_alerts WHERE updatedAt > ? ORDER BY updatedAt DESC LIMIT 200`
    )
    .bind(yesterday)
    .all();
  res.status(200).json(results);
};

export default handler;
