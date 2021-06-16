import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const GSIBaseLayer = () => {
  return (
    <LayersControl.BaseLayer checked name='電子国土基本図 淡色地図'>
      <TileLayer
        attribution='&copy; <a href="https://www.gsi.go.jp/kibanjoho/mapinfo_what.html">出典：国土地理院 電子国土基本図</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'
      />
    </LayersControl.BaseLayer>
  );
};
