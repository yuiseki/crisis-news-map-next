import mongoose from 'mongoose';

export interface IWeatherAlert {
  originId: string;
  title: string;
  content: string;
  warnLevel: number;
  // time
  createdAt: string;
  updatedAt: string;
  observedAt: Date;
  // place
  placeCountry: string;
  placePref: string;
  // gps
  latitude: number;
  longitude: number;
}

interface IWeatherAlertModel extends IWeatherAlert, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    originId: String,
    title: String,
    content: String,
    warnLevel: Number,
    // time
    observedAt: Date,
    // place
    placeCountry: String,
    placePref: String,
    // gps
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export const WeatherAlert =
  mongoose.models.WeatherAlert ||
  mongoose.model<IWeatherAlertModel>('WeatherAlert', schema);
