import React, { useCallback } from 'react';
import { LayersControl, GeoJSON } from 'react-leaflet';
import useSWR from 'swr';

export const JapanCityOverlayLayer = () => {
  const { data } = useSWR('/data/japan_cities.geojson');
  const onEachFeature = useCallback((feature, layer) => {
    layer.bindTooltip(feature.properties.cityname_k);
  }, []);
  return (
    <LayersControl.Overlay name='市区町村境界'>
      {data && (
        <GeoJSON
          data={data.features}
          style={{ weight: 1, opacity: 0.5, fillOpacity: 0.2 }}
          onEachFeature={onEachFeature}
        />
      )}
    </LayersControl.Overlay>
  );
};
