import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await getDb();
  const {
    category,
    confirmed,
    hasLocation,
    hasDetailLocation,
    country,
    pref,
    city,
  } = req.query;
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

  const clauses: string[] = [];
  const params: unknown[] = [];
  if (category) {
    clauses.push('(category = ? OR tags LIKE ?)');
    params.push(category, `%"${category}"%`);
  }
  if (confirmed === 'true') {
    clauses.push('sourceConfirmed = 1');
  }
  if (hasLocation === 'true') {
    clauses.push('latitude IS NOT NULL AND longitude IS NOT NULL');
  }
  if (hasDetailLocation === 'true') {
    clauses.push('placeCountry IS NOT NULL AND placePref IS NOT NULL');
  }
  if (country) {
    clauses.push('placeCountry = ?');
    params.push(country);
  }
  if (pref) {
    clauses.push('placePref = ?');
    params.push(pref);
  }
  if (city) {
    clauses.push('placeCity = ?');
    params.push(city);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM news ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
  const { results } = await db
    .prepare(sql)
    .bind(...params, limit, skip)
    .all();

  const json = (results as any[]).map((row) => ({
    ...row,
    sourceConfirmed: !!row.sourceConfirmed,
    factConfirmed: !!row.factConfirmed,
    fakeConfirmed: !!row.fakeConfirmed,
    tags: row.tags ? JSON.parse(row.tags as string) : [],
  }));

  res.status(200).json(json);
};

export default handler;
