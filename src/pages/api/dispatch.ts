import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT * FROM dispatches ORDER BY "updatedAt" DESC LIMIT 200`
  );
  res.status(200).json(rows);
};

export default handler;
