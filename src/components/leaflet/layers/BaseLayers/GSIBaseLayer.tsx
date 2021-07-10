import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const GSIBaseLayer = () => {
  return (
    <LayersControl.BaseLayer checked name='国土地理院 白地図'>
      <TileLayer
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html#blank">国土地理院</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png'
        maxNativeZoom={14}
        maxZoom={20}
      />
    </LayersControl.BaseLayer>
  );
};
