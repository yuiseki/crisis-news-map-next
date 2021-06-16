import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const NowcastOverlayLayer = () => {
  const time = '20210613112000';
  const baseTime = time;
  const validTime = time;
  return (
    <LayersControl.Overlay name='ナウキャスト'>
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>'
        url={
          'https://www.jma.go.jp/bosai/jmatile/data/nowc/' +
          baseTime +
          '/none/' +
          validTime +
          '/surf/hrpns/{z}/{x}/{y}.png'
        }
      />
    </LayersControl.Overlay>
  );
};
