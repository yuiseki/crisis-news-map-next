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
  const condition = {};
  if (hasLocation === 'true') {
    Object.assign(condition, {
      longitude: { $ne: null },
      latitude: { $ne: null },
    });
  }
  if (category) {
    Object.assign(condition, { category: category });
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
    limit: 200,
  });
  res.status(200).json(json);
};

export default handler;
