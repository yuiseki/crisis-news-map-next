import mongoose from 'mongoose';

export interface INews {
  createdAt: string;
  updatedAt: string;
  url: string;
  title: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  ogUrl: string;
  category: string;
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
    category: String,
    placeCountry: String,
    placePref: String,
    placeCity: String,
    placeRiver: String,
    placeMountain: String,
    placeStation: String,
    placeAirport: String,
    placePolice: String,
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export const News =
  mongoose.models.News || mongoose.model<INewsModel>('News', schema);
