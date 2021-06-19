import mongoose from 'mongoose';

interface IRiverLevel {
  code: string;
  name: string;
  obsTime: string;
  point: number;
  level: number;
  latitude: number;
  longitude: number;
  townCode: string;
  prefCode: string;
  over: number;
  startLevel: number;
  warnLevel: number;
  fladLevel: number;
  observedAt: Date;
  placeCountry: string;
  placePref: string;
  placeRiver: string;
  isFlood: boolean;
  category: string;
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
