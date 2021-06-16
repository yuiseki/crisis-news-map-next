import React from 'react';
import { LayersControl, GeoJSON } from 'react-leaflet';
import useSWR from 'swr';

export const JapanPrefOverlayLayer = () => {
  const { data } = useSWR('/data/japan.geojson');

  return (
    <LayersControl.Overlay name='都道府県境界'>
      {data && (
        <GeoJSON data={data.features} style={{ weight: 5, opacity: 0.5 }} />
      )}
    </LayersControl.Overlay>
  );
};
