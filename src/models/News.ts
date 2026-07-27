// Plain type definition - the mongoose Model this file used to export was
// dropped as part of the MongoDB -> D1 migration (see src/lib/d1Client.ts
// and src/lib/db.ts). Kept as a type-only export since several components
// still import INews for prop typing.
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
