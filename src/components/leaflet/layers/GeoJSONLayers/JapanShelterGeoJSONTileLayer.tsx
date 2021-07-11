import React from 'react';
import Leaflet from 'leaflet';

import AbstractGeoJSONTileLayer from './AbstractGeoJSONTileLayer';

export const JapanShelterLayer = () => {
  const pointToLayer = (feature, latlng) => {
    //const name = feature.properties.name;
    //const address = feature.properties.address;
    return Leaflet.circle(latlng);
  };
  return (
    <AbstractGeoJSONTileLayer
      id='japan-shelter-overlay-layer'
      name='指定緊急避難場所'
      url='https://maps.gsi.go.jp/xyz/skhb01/{z}/{x}/{y}.geojson'
      maxNativeZoom={10}
      minNativeZoom={10}
      pointToLayer={pointToLayer}
    />
  );
};
