import mongoose from 'mongoose';

export interface INews {
  url: string;
  domain: string;
  title: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  ogUrl: string;
  // source
  sourceType: string;
  sourceName: string;
  sourceConfirmed: boolean;
  factConfirmed: boolean;
  fakeConfirmed: boolean;
  // classify
  category: string;
  tags: string[];
  // time
  createdAt: string;
  updatedAt: string;
  // place
  placeCountry: string;
  placePref: string;
  placeCity: string;
  placeRiver: string;
  placeMountain: string;
  placeStation: string;
  placeAirport: string;
  placePolice: string;
  // gps
  latitude: number;
  longitude: number;
}

interface INewsModel extends INews, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    url: String,
    title: String,
    ogTitle: String,
    ogDesc: String,
    ogImage: String,
    ogUrl: String,
    // source
    sourceType: String,
    sourceName: String,
    sourceConfirmed: Boolean,
    factConfirmed: {
      type: Boolean,
      default: false,
    },
    fakeConfirmed: {
      type: Boolean,
      default: false,
    },
    // classify
    category: String,
    tags: [{ type: String }],
    // place
    placeCountry: String,
    placePref: String,
    placeCity: String,
    placeRiver: String,
    placeMountain: String,
    placeStation: String,
    placeAirport: String,
    placePolice: String,
    // gps
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export const News =
  mongoose.models.News || mongoose.model<INewsModel>('News', schema);
