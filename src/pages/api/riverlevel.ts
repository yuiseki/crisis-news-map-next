import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiRes = await fetch('https://crisis.yuiseki.net/riverlevel');
  const json = await apiRes.json();
  res.status(200).json(json);
};

export default handler;