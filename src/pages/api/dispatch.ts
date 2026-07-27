import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDb();
  const { results } = await db
    .prepare(`SELECT * FROM dispatches ORDER BY updatedAt DESC LIMIT 200`)
    .all();
  res.status(200).json(results);
};

export default handler;
