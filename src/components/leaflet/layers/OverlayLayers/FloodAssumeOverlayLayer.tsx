import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const FloodAssumeLayer = () => {
  const url =
    'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png';
  return (
    <>
      {url && (
        <AbstractOverlayLayer
          id='flood-assume-overlay-layer'
          name='洪水浸水想定区域'
          attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
          url={url}
          opacity={1}
        />
      )}
    </>
  );
};
