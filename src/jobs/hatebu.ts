import { dbConnect } from '../lib/dbConnect';
import categoryWords from '../data/yuiseki.net/detector_category_words.json';
import { fetchFeedArticles } from '~/lib/crawl';

const crawl = async () => {
  await dbConnect();
  for (const category of Object.keys(categoryWords)) {
    if (
      category !== 'virus' &&
      category !== 'poverty' &&
      category !== 'children' &&
      category !== 'drug'
    ) {
      continue;
    }
    // eslint-disable-next-line no-console
    console.log(category);
    for (const word of categoryWords[category]) {
      // eslint-disable-next-line no-console
      console.log(word);
      await fetchFeedArticles(
        `https://b.hatena.ne.jp/search/title?q=${encodeURI(
          word
        )}&users=1&mode=rss`
      );
    }
  }
  process.exit(0);
};

(async () => {
  await crawl();
})();
