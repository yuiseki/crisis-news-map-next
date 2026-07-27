import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT * FROM river_levels WHERE "isFlood" = true ORDER BY "updatedAt" DESC LIMIT 200`
  );
  const riverLevels = rows.map((row) => ({
    ...row,
    isFlood: !!row.isFlood,
  }));
  res.status(200).json(riverLevels);
};

export default handler;
