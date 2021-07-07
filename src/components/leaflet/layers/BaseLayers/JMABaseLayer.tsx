import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const JMABaseLayer = () => {
  return (
    <LayersControl.BaseLayer checked name='気象庁 白地図'>
      <TileLayer
        attribution='<a href="https://www.jma.go.jp/">気象庁</a>'
        url='https://www.jma.go.jp/tile/jma/base/{z}/{x}/{y}.png'
      />
    </LayersControl.BaseLayer>
  );
};
