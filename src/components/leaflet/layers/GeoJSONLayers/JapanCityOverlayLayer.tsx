import React, { useCallback } from 'react';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanCityOverlayLayer = () => {
  const onEachFeature = useCallback((feature, layer) => {
    layer.bindTooltip(feature.properties.cityname_k);
  }, []);
  return (
    <AbstractGeoJSONLayer
      id='japan-city-overlay-layer'
      name='市区町村境界'
      url='/data/japan_cities.geojson'
      style={{ weight: 1, opacity: 0.5, fillOpacity: 0.1 }}
      onEachFeature={onEachFeature}
    />
  );
};
