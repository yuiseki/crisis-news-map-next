import React, { useCallback } from 'react';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanCityGeoJSONLayer = () => {
  const onEachFeature = useCallback((feature, layer) => {
    layer.bindTooltip(feature.properties.cityname_k);
  }, []);
  return (
    <AbstractGeoJSONLayer
      id='japan-city-overlay-layer'
      name='市区町村境界'
      url='/data/japan_cities.geojson'
      style={{ weight: 0.5, opacity: 0.5, fillOpacity: 0.01 }}
      onEachFeature={onEachFeature}
    />
  );
};
