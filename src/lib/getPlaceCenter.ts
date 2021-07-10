import { countries, states, cities } from 'detect-location-jp';
import { LatLngTuple } from 'leaflet';

export const getPlaceCenter = (country, state, city) => {
  let center = [36.5748441, 139.2394179] as LatLngTuple;
  if (country) {
    for (const c of countries) {
      if (c === country) {
        center = [c.latitude, c.longitude];
      }
    }
  }
  if (country === '日本' && state) {
    for (const s of states) {
      if (s.state_ja === state) {
        center = [s.latitude, s.longitude];
      }
    }
  }
  if (country === '日本' && city) {
    for (const c of cities) {
      if (c.city_ja === city) {
        center = [c.latitude, c.longitude];
      }
    }
  }
  return center;
};
