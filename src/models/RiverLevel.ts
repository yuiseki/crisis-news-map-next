import mongoose from 'mongoose';

interface IRiverLevel {
  createdAt: string;
  updatedAt: string;
  observedAt: Date;
  code: string;
  name: string;
  obsTime: string;
  point: number;
  level: number;
  townCode: string;
  prefCode: string;
  over: number;
  startLevel: number;
  warnLevel: number;
  fladLevel: number;
  isFlood: boolean;
  category: string;
  // place
  placeCountry: string;
  placePref: string;
  placeRiver: string;
  // gps
  latitude: number;
  longitude: number;
}

interface IRiverLevelModel extends IRiverLevel, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    code: String,
    name: String,
    obsTime: String,
    point: Number,
    level: Number,
    latitude: Number,
    longitude: Number,
    townCode: String,
    prefCode: String,
    over: Number,
    startLevel: Number,
    warnLevel: Number,
    fladLevel: Number,
    observedAt: Date,
    placeCountry: String,
    placePref: String,
    placeRiver: String,
    isFlood: Boolean,
    category: String,
  },
  { timestamps: true }
);

export const RiverLevel =
  mongoose.models.RiverLevel ||
  mongoose.model<IRiverLevelModel>('RiverLevel', schema);
