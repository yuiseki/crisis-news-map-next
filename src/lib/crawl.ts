import fetch from 'node-fetch';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import sleep from '~/lib/sleep';
import { INews, News } from '~/models/News';
import { detectCategories } from 'detect-categories-ja';
import { detectLocation } from 'detect-location-jp';

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
  const text = news.ogTitle + news.ogDesc;
  if (text === 0) {
    return news;
  }
  try {
    const categories = await detectCategories(text);
    news.category = categories[0]?.id;
    news.tags = categories.map((cat) => {
      return cat.id;
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(text);
    console.error(e);
  }
  const location = await detectLocation(text);
  if (location === null) {
    return news;
  }
  news.placeCountry = location.country;
  news.placePref = location.state;
  news.placeCity = location.city;
  news.latitude = location.latitude;
  news.longitude = location.longitude;
  return news;
};
