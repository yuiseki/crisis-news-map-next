import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const PopulationOverlayLayer = () => {
  const url =
    'https://ktgis.net/kjmapw/kjtilemap/pop_density2015/{z}/{x}/{y}.png';
  return (
    <>
      {url && (
        <AbstractOverlayLayer
          id='nowcast-overlay-layer'
          name='人口密度'
          attribution='人口密度'
          url={url}
          opacity={0.5}
        />
      )}
    </>
  );
};
