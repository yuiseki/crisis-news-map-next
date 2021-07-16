import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '~/lib/dbConnect';
import { News } from '~/models/News';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const { category, confirmed, hasLocation, country, pref, city } = req.query;
  const limitStr = req.query.limit ? req.query.limit : 100;
  // @ts-ignore
  let limit = parseInt(limitStr);
  if (limit > 1000) {
    limit = 1000;
  }
  const pageStr = req.query.page ? req.query.page : 1;
  // @ts-ignore
  const page = parseInt(pageStr);
  const skip = limit * (page - 1);
  const condition = {};
  if (category) {
    Object.assign(condition, {
      $or: [{ category: category }, { tags: category }],
    });
  }
  if (confirmed === 'true') {
    Object.assign(condition, { sourceConfirmed: true });
  }
  if (hasLocation === 'true') {
    Object.assign(condition, {
      latitude: { $ne: null },
      longitude: { $ne: null },
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
    skip: skip,
    limit: limit,
  });
  res.status(200).json(json);
};

export default handler;
