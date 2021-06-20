import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '~/lib/dbConnect';
import { News } from '~/models/News';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const category = req.query.category;
  let condition = {};
  if (category) {
    condition = { category: category };
  }
  const riverLevels = await News.find(condition, null, {
    sort: { updatedAt: 1 },
    limit: 200,
  });
  res.status(200).json(riverLevels);
};

export default handler;
