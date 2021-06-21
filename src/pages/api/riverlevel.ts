import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '~/lib/dbConnect';
import { RiverLevel } from '~/models/RiverLevel';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const riverLevels = await RiverLevel.find({ isFlood: true }, null, {
    sort: { updatedAt: -1 },
    limit: 200,
  });
  res.status(200).json(riverLevels);
};

export default handler;
