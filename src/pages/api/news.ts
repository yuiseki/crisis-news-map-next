import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = getDb();
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
  // Array.push returns the new length, which is exactly the 1-indexed
  // Postgres placeholder position of the value just pushed.
  const push = (v: unknown) => `$${params.push(v)}`;
  if (category) {
    const catIdx = push(category);
    const tagsIdx = push(`%"${category}"%`);
    clauses.push(`(category = ${catIdx} OR tags::text LIKE ${tagsIdx})`);
  }
  if (confirmed === 'true') {
    clauses.push('"sourceConfirmed" = true');
  }
  if (hasLocation === 'true') {
    clauses.push('latitude IS NOT NULL AND longitude IS NOT NULL');
  }
  if (hasDetailLocation === 'true') {
    clauses.push('"placeCountry" IS NOT NULL AND "placePref" IS NOT NULL');
  }
  if (country) {
    clauses.push(`"placeCountry" = ${push(country)}`);
  }
  if (pref) {
    clauses.push(`"placePref" = ${push(pref)}`);
  }
  if (city) {
    clauses.push(`"placeCity" = ${push(city)}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const limitIdx = push(limit);
  const offsetIdx = push(skip);
  const sql = `SELECT * FROM news ${where} ORDER BY "createdAt" DESC LIMIT ${limitIdx}::int OFFSET ${offsetIdx}::int`;
  const { rows } = await db.query(sql, params);

  const json = rows.map((row) => ({
    ...row,
    sourceConfirmed: !!row.sourceConfirmed,
    factConfirmed: !!row.factConfirmed,
    fakeConfirmed: !!row.fakeConfirmed,
    tags: row.tags ?? [],
  }));

  res.status(200).json(json);
};

export default handler;
