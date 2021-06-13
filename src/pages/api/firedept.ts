import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiRes = await fetch('https://crisis.yuiseki.net/firedept?daysago=1');
  const json = await apiRes.json();
  res.status(200).json(json);
};

export default handler;
