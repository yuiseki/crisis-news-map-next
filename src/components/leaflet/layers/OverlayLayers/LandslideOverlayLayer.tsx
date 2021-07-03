import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const LandslideLayer = () => {
  const url =
    'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png';
  return (
    <>
      {url && (
        <AbstractOverlayLayer
          id='landslide-overlay-layer'
          name='土砂災害警戒区域'
          attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
          url={url}
          opacity={1}
        />
      )}
    </>
  );
};
