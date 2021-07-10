import React, { useCallback } from 'react';
import useSWR from 'swr';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanPrefOverlayLayer = () => {
  const { data } = useSWR('/api/weather');
  const onEachFeature = useCallback(
    (feature, layer) => {
      if (!data) {
        return;
      }
      const prefName = feature.properties.nam_ja;
      const prefAlerts = [];
      for (const item of data) {
        if (item.placePref === prefName) {
          prefAlerts.push(item);
        }
      }
      layer.bindTooltip(prefName + ':' + prefAlerts.length);
    },
    [data]
  );
  const styleFunction = useCallback(
    (feature) => {
      if (!data) {
        return;
      }
      const prefName = feature.properties.nam_ja;
      let fillOpacity = 0.01;
      let color = 'yellow';
      for (const item of data) {
        if (item.placePref === prefName) {
          fillOpacity = Math.fround(fillOpacity * 2.5);
          if (item.content.indexOf('特別警報') > 0) {
            fillOpacity = Math.fround(fillOpacity * 5);
            color = 'red';
          }
        }
      }
      return {
        weight: 0.01,
        opacity: 1,
        color: color,
        fillOpacity: fillOpacity,
      };
    },
    [data]
  );
  return (
    <AbstractGeoJSONLayer
      id='japan-pref-overlay-layer'
      name='都道府県境界'
      url='/data/japan.geojson'
      style={styleFunction}
      onEachFeature={onEachFeature}
    />
  );
};
