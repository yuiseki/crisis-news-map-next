import { NextApiRequest, NextApiResponse } from 'next';
import vaccineData from '~/data/precomputed/vaccine.json';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(vaccineData);
};

export default handler;
