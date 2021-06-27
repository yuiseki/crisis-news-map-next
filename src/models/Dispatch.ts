import mongoose from 'mongoose';

interface IDispatch {
  originId: string;
  category: string;
  unit: string;
  detail: string;
  division: string;
  status: string;
  // time
  time_str: string;
  createdAt: string;
  updatedAt: string;
  observedAt: Date;
  // place
  placeCountry: string;
  placePref: string;
  placeCity: string;
  // gps
  latitude: number;
  longitude: number;
}

interface IDispatchModel extends IDispatch, mongoose.Document {}

const schema = new mongoose.Schema(
  {
    originId: String,
    category: String,
    unit: String,
    detail: String,
    division: String,
    latitude: Number,
    longitude: Number,
    placeCountry: String,
    placePref: String,
    placeCity: String,
    status: String,
    // time
    time_str: String,
    observedAt: Date,
  },
  { timestamps: true }
);

export const Dispatch =
  mongoose.models.Dispatch ||
  mongoose.model<IDispatchModel>('Dispatch', schema);
