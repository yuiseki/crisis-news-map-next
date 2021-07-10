import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const GSIHazardMapLayers = () => {
  const attribution =
    '<a href="https://disaportal.gsi.go.jp/maps/">重ねるハザードマップ</a>';
  return (
    <>
      <AbstractOverlayLayer
        id='flood-assume-overlay-layer'
        name='国土地理院 洪水浸水想定区域'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='flood-assume-overlay-layer'
        name='国土地理院 津波浸水想定区域'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='debris-flow-overlay-layer'
        name='国土地理院 土石流警戒区域'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='debris-flow-overlay-layer'
        name='国土地理院 土石流警戒渓流'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='landslide-overlay-layer'
        name='国土地理院 地すべり警戒区域'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='steep-slope-overlay-layer'
        name='国土地理院 急傾斜崩壊警戒区域'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='steep-slope-overlay-layer'
        name='国土地理院 道路冠水想定箇所'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/10_kansui/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='steep-slope-overlay-layer'
        name='国土地理院 事前通行規制区間'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/10_jizentuukoukiseikukan/{z}/{x}/{y}.png'
        opacity={1}
      />
      <AbstractOverlayLayer
        id='steep-slope-overlay-layer'
        name='国土地理院 予防的通行規制区間'
        attribution={attribution}
        url='https://disaportaldata.gsi.go.jp/raster/10_yoboutekituukoukiseikukan/{z}/{x}/{y}.png'
        opacity={1}
      />
    </>
  );
};
