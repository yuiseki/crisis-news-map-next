import { dbConnect } from '../lib/dbConnect';
import Parser from 'rss-parser';
import { detectLocation } from 'detect-location-jp';
import { WeatherAlert } from '~/models/WeatherAlert';

const rssParser = new Parser();

const crawl = async () => {
  await dbConnect();
  const feedUrl = 'http://www.data.jma.go.jp/developer/xml/feed/extra.xml';
  const feed = await rssParser.parseURL(feedUrl);
  const alerts = await convertFeed(feed);
  for await (const alert of alerts) {
    const query = {
      originId: alert.originId,
    };
    await WeatherAlert.findOneAndUpdate(query, alert, { upsert: true });
  }
  process.exit(0);
};

const convertFeed = async (feed: any) => {
  const alerts = [];
  for await (const item of feed.items) {
    if (item.title !== '気象特別警報・警報・注意報') {
      continue;
    }
    const location = await detectLocation(item.content);
    if (location === null) {
      continue;
    }
    const observedAt = new Date(Date.parse(item.pubDate));
    const alert = {
      originId: item.id,
      title: item.title,
      content: item.content,
      observedAt: observedAt,
      placeCountry: location.country,
      placePref: location.state,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    alerts.push(alert);
  }
  return alerts;
};

(async () => {
  await crawl();
})();
