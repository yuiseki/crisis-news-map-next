import mongoose from 'mongoose';

interface INews {
  url: string;
  title: string;
  og_title: string;
  og_desc: string;
  og_image: string;
  og_url: string;
  category: string;
  place_country: string;
  place_pref: string;
  place_city: string;
  place_river: string;
  place_mountain: string;
  place_station: string;
  place_airport: string;
  place_police: string;
  lat: number;
  lng: number;
  geohash: string;
}

interface INewsModel extends INews, mongoose.Document {}

const newsSchema = new mongoose.Schema({
  url: String,
  enurl: String,
  html: String,
});

export const News = mongoose.model<INewsModel>('News', newsSchema);
