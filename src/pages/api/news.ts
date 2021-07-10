import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '~/lib/dbConnect';
import { News } from '~/models/News';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const category = req.query.category;
  const hasLocation = req.query.hasLocation;
  const country = req.query.country;
  const pref = req.query.pref;
  const city = req.query.city;
  const limit = req.query.limit;
  const page = req.query.page;
  const condition = {};
  if (category) {
    Object.assign(condition, { category: category });
  }
  if (hasLocation === 'true') {
    Object.assign(condition, {
      longitude: { $ne: null },
      latitude: { $ne: null },
    });
  }
  if (country) {
    Object.assign(condition, { placeCountry: country });
  }
  if (pref) {
    Object.assign(condition, { placePref: pref });
  }
  if (city) {
    Object.assign(condition, { placeCity: city });
  }
  const json = await News.find(condition, null, {
    sort: { createdAt: -1 },
    // @ts-ignore
    offset: parseInt(limit) + parseInt(page),
    // @ts-ignore
    limit: parseInt(limit),
  });
  res.status(200).json(json);
};

export default handler;
