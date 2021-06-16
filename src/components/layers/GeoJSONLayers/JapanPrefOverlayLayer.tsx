import React from 'react';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanPrefOverlayLayer = () => {
  return (
    <AbstractGeoJSONLayer
      id='japan-pref-overlay-layer'
      name='都道府県境界'
      url='/data/japan.geojson'
      style={{ weight: 5, opacity: 0.5 }}
    />
  );
};
