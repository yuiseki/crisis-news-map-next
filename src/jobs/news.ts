import fetch from 'node-fetch';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { dbConnect } from '../lib/dbConnect';
import { INews, News } from '~/models/News';
import { Detector } from '~/lib/detector';

import massMediaList from '../data/yuiseki.net/mass_media_japan.json';
const parser = new Parser();

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const crawl = async () => {
  await dbConnect();
  for (const massMedia of massMediaList) {
    // eslint-disable-next-line no-console
    console.log(massMedia.name + ': ' + massMedia.feed);
    if (massMedia.feed === null) {
      continue;
    }
    const feed = await parser.parseURL(massMedia.feed);
    for await (const item of feed.items) {
      const url = item.link;
      // eslint-disable-next-line no-console
      console.log(url);
      try {
        const res = await fetch(url, { timeout: 1000 });
        const html = await res.text();
        const ogp = await parseHTML(url, html);
        const news: INews = await convertOGP(ogp);
        if (news.placeCountry !== '日本') {
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
        await sleep(1000);
      }
    }
  }
  process.exit(0);
};

const parseHTML = async (url: string, html: string) => {
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

const convertOGP = async (news: any) => {
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

(async () => {
  await crawl();
})();
