import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const GsiReliefOverlayLayer = () => {
  return (
    <LayersControl.Overlay name='国土地理院色別標高図'>
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
      />
    </LayersControl.Overlay>
  );
};
