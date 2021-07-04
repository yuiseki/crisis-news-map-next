import mongoose from 'mongoose';

export interface ITweet {
  tweetId: string;
  text: string;
  authorId: string;
  source: string;
  photos?: string[];
  urls?: string[];
  // metrics
  countRetweet: number;
  countReply: number;
  countLike: number;
  countQuote: number;
  // categories
  categories?: string[];
  // place
  placeCountry?: string;
  placePref?: string;
  placeCity?: string;
  // gps
  latitude?: number;
  longitude?: number;
  // time
  createdAt?: string;
  updatedAt?: string;
  tweetedAt: Date;
}

interface ITweetModel extends ITweet, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    tweetId: String,
    text: String,
    authorId: String,
    source: String,
    photos: [{ type: String }],
    urls: [{ type: String }],
    // metrics
    countRetweet: Number,
    countReply: Number,
    countLike: Number,
    countQuote: Number,
    // categories
    categories: [{ type: String }],
    // place
    placeCountry: String,
    placePref: String,
    placeCity: String,
    // time
    tweetedAt: Date,
  },
  { timestamps: true }
);

export const Tweet =
  mongoose.models.Tweet || mongoose.model<ITweetModel>('Tweet', schema);
