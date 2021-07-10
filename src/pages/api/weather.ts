import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '~/lib/dbConnect';
import { WeatherAlert } from '~/models/WeatherAlert';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const today = new Date();
  const yesterday = today.setDate(today.getDate() - 1);
  const condition = { updatedAt: { $gt: yesterday.toString() } };

  const alerts = await WeatherAlert.find(condition, null, {
    sort: { updatedAt: -1 },
    limit: 200,
  });
  res.status(200).json(alerts);
};

export default handler;
