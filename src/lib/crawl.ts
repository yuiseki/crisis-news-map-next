import fetch from 'node-fetch';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import sleep from '~/lib/sleep';
import { Detector } from '~/lib/detector';
import { INews, News } from '~/models/News';

const rssParser = new Parser();

export const fetchFeedArticles = async (feedUrl) => {
  // eslint-disable-next-line no-console
  console.log(feedUrl);
  let feed = { items: [] };
  try {
    feed = await rssParser.parseURL(feedUrl);
  } catch (e) {
    console.error(e);
  }
  for await (const item of feed.items) {
    const url = item.link;
    // eslint-disable-next-line no-console
    console.log(url);
    try {
      const res = await fetch(url, { timeout: 3000 });
      const html = await res.text();
      const ogp = await parseOGP(url, html);
      const news: INews = await convertOGP(ogp);
      if (
        news.category !== 'crisis' &&
        news.category !== 'virus' &&
        news.category !== 'poverty' &&
        news.category !== 'children' &&
        news.category !== 'drug' &&
        news.category !== 'nikkei'
      ) {
        continue;
      }
      // eslint-disable-next-line no-console
      console.log(news);
      const query = {
        url: news.url,
      };
      await News.findOneAndUpdate(query, news, {
        upsert: true,
      });
    } catch (e) {
      console.error(e);
    } finally {
      await sleep(500);
    }
  }
};

export const parseOGP = async (url: string, html: string) => {
  const result: any = {
    title: null,
    url: url,
    ogTitle: null,
    ogDesc: null,
    ogImage: null,
    ogUrl: null,
  };
  const document = cheerio.load(html);
  result.title = document('title').text();
  if (result.title === undefined) {
    result.title = null;
  }
  result.ogTitle = document("meta[property='og:title']").attr('content');
  if (result.ogTitle === undefined) {
    result.ogTitle = null;
  }
  result.ogDesc = document("meta[property='og:description']").attr('content');
  if (result.ogDesc === undefined) {
    result.ogDesc = null;
  }
  result.ogImage = document("meta[property='og:image']").attr('content');
  if (result.ogImage === undefined) {
    result.ogImage = null;
  }
  result.ogUrl = document("meta[property='og:url']").attr('content');
  if (result.ogUrl === undefined) {
    result.ogUrl = null;
  } else {
    result.url = result.ogUrl;
  }
  return result;
};

export const convertOGP = async (news: any) => {
  const detector = new Detector(news.ogTitle + news.ogDesc);
  await detector.ready;
  news.category = detector.category;
  news.placeCountry = detector.country;
  news.placePref = detector.pref;
  news.placeCity = detector.city;
  news.latitude = detector.location.lat;
  news.longitude = detector.location.long;
  return news;
};
