import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const GSIBaseLayer = () => {
  return (
    <LayersControl.BaseLayer name='電子国土基本図 白地図'>
      <TileLayer
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png'
        maxNativeZoom={14}
      />
    </LayersControl.BaseLayer>
  );
};
