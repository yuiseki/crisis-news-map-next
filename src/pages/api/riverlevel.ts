import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT * FROM river_levels WHERE isFlood = 1 ORDER BY updatedAt DESC LIMIT 200`
    )
    .all();
  const riverLevels = (results as any[]).map((row) => ({
    ...row,
    isFlood: !!row.isFlood,
  }));
  res.status(200).json(riverLevels);
};

export default handler;
