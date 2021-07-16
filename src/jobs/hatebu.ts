import { dbConnect } from '../lib/dbConnect';
import { fetchFeedArticles } from '~/lib/crawl';
import { categories } from 'detect-categories-ja';

const crawl = async () => {
  await dbConnect();
  for (const category of categories) {
    if (
      category.id !== 'crisis' &&
      category.id !== 'virus' &&
      category.id !== 'poverty' &&
      category.id !== 'refugee' &&
      category.id !== 'child_abuse' &&
      category.id !== 'drug_abuse' &&
      category.id !== 'nikkei'
    ) {
      continue;
    }
    // eslint-disable-next-line no-console
    console.log('job:hatebu', category);
    for (const word of category.words) {
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
