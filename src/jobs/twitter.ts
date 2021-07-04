import TwitterApi, { MediaObjectV2, TweetV2, UserV2 } from 'twitter-api-v2';
import { detectLocation } from 'detect-location-jp';
import {
  detectCategories,
  categories as definedCategories,
} from 'detect-categories-ja';
import { dbConnect } from '../lib/dbConnect';
import { Tweet, ITweet } from '~/models/Tweet';

import dotenv from 'dotenv';
dotenv.config();

interface Tweet extends TweetV2 {
  media: MediaObjectV2[];
  user: UserV2;
}

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_TOKEN_SECRET,
});

const crawl = async () => {
  await dbConnect();
  for await (const category of definedCategories) {
    switch (category.id) {
      case 'crisis':
        await searchAndSaveWords(category.words);
        break;
      case 'poverty':
        await searchAndSaveWords(category.words);
        break;
      default:
        break;
    }
  }
  process.exit(0);
};

const searchAndSaveWords = async (words: string[]) => {
  for await (const word of words) {
    // eslint-disable-next-line no-console
    console.log(word);
    await searchAndSave(word);
  }
};

const searchAndSave = async (word: string) => {
  const tweets = await fetchTwitterSearch(word, true);
  for (const tw of tweets) {
    const tweet = await convertTweet(tw);
    const query = {
      tweetId: tw.id,
    };
    await Tweet.findOneAndUpdate(query, tweet, { upsert: true });
  }
};

const convertTweet = async (tweet: Tweet): Promise<ITweet> => {
  const photos = tweet.media
    ?.filter((m) => {
      return m.type === 'photo';
    })
    .map((m) => {
      if (m.url) {
        return m.url;
      } else {
        return m.preview_image_url;
      }
    });
  const urls = tweet.entities?.urls?.map((u) => {
    return u.expanded_url;
  });
  const tweetedAt = new Date(tweet.created_at);
  const result: ITweet = {
    tweetId: tweet.id,
    text: tweet.text,
    authorId: tweet.author_id,
    source: tweet.source,
    photos: photos,
    urls: urls,
    tweetedAt: tweetedAt,
    countRetweet: tweet.public_metrics.retweet_count,
    countReply: tweet.public_metrics.reply_count,
    countLike: tweet.public_metrics.like_count,
    countQuote: tweet.public_metrics.quote_count,
  };
  const categories = (await detectCategories(tweet.text)).map((c) => {
    return c.name;
  });
  if (categories.length > 0) {
    result.categories = categories;
  }
  const location = await detectLocation(tweet.text);
  if (location) {
    result.placeCountry = location.country;
    result.placePref = location.state;
    result.placeCity = location.city;
    result.latitude = parseFloat(location.latitude);
    result.longitude = parseFloat(location.longitude);
  }
  return result;
};

const fetchTwitterSearch = async (query: string, excludeRetweets = false) => {
  if (excludeRetweets) {
    query = query + ' -is:retweet';
  }

  // tweet.fields, media.fields, user.fieldsを要求しないとid, text, created_atしか返ってこない
  // media.fieldsを要求するためにはexpansionsにattachments.media_keysが必要
  // user.fieldsを要求するためにはexpansionsにauthor_idが必要
  const res = await client.v2.search(query, {
    max_results: 100,
    expansions: 'attachments.media_keys,author_id',
    'tweet.fields':
      'created_at,attachments,entities,referenced_tweets,source,public_metrics',
    'media.fields': 'type,url,preview_image_url,width,height,public_metrics',
    'user.fields':
      'created_at,description,entities,location,url,profile_image_url,public_metrics',
  });

  // tweet.fieldsのみのオブジェクトの配列
  const tweets = res.tweets;
  if (!tweets) {
    return [];
  }
  // media.fieldsのみのオブジェクトの配列
  // @ts-ignore
  const media = res._realData.includes?.media;
  // user.fieldsのみのオブジェクトの配列
  // @ts-ignore
  const users = res._realData.includes?.users;

  // tweet.fieldsのみのオブジェクトにmediaオブジェクトとuserオブジェクトを埋め込む
  const result = [];
  for (const tw of tweets) {
    if (tw.attachments && tw.attachments.media_keys) {
      // @ts-ignore
      tw.media = [];
      for (const media_key of tw.attachments.media_keys) {
        for (const medium of media) {
          if (media_key === medium.media_key) {
            // @ts-ignore
            tw.media.push(medium);
          }
        }
      }
    }
    for (const user of users) {
      if (tw.author_id === user.id) {
        // @ts-ignore
        tw.user = user;
      }
    }
    result.push(tw);
  }

  return result;
};

(async () => {
  await crawl();
})();
