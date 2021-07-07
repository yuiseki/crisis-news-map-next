import React, { useCallback } from 'react';
import useSWR from 'swr';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanPrefOverlayLayer = () => {
  const { data } = useSWR('/api/weather');
  const onEachFeature = useCallback(
    (feature, layer) => {
      const prefName = feature.properties.nam_ja;
      const prefAlerts = [];
      if (!data) {
        return;
      }
      for (const item of data) {
        if (item.placePref === prefName) {
          prefAlerts.push(item);
        }
      }
      layer.bindTooltip(prefName + ':' + prefAlerts.length);
    },
    [data]
  );
  return (
    <AbstractGeoJSONLayer
      id='japan-pref-overlay-layer'
      name='都道府県境界'
      url='/data/japan.geojson'
      style={{ weight: 0.5, opacity: 0.5, fillOpacity: 0.01 }}
      onEachFeature={onEachFeature}
    />
  );
};
