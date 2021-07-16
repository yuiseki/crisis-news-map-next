import { dbConnect } from '../lib/dbConnect';
import massMediaList from '../data/yuiseki.net/mass_media_japan.json';
import { fetchFeedArticles } from '~/lib/crawl';

const crawl = async () => {
  await dbConnect();
  for (const massMedia of massMediaList) {
    // eslint-disable-next-line no-console
    console.log(massMedia.name);
    const source = {
      domain: massMedia.domain,
      sourceType: massMedia.classification,
      sourceName: massMedia.name,
      sourceConfirmed: true,
    };
    if (massMedia.feed !== null) {
      await fetchFeedArticles(massMedia.feed, source);
    }
    if (massMedia.domain !== null) {
      await fetchFeedArticles(
        `https://b.hatena.ne.jp/site/${massMedia.domain}/?sort=eid&mode=rss`,
        source
      );
    }
  }
  process.exit(0);
};

(async () => {
  await crawl();
})();
