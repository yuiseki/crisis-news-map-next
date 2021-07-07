import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const GSIHazardMapLayers = () => {
  return (
    <>
      <AbstractOverlayLayer
        id='flood-assume-overlay-layer'
        name='国土地理院 洪水浸水想定区域'
        attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
        url='https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='debris-flow-overlay-layer'
        name='国土地理院 土石流警戒区域'
        attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
        url='https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='landslide-overlay-layer'
        name='国土地理院 地すべり警戒区域'
        attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
        url='https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='steep-slope-overlay-layer'
        name='国土地理院 急傾斜崩壊警戒区域'
        attribution='<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
        url='https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
    </>
  );
};
