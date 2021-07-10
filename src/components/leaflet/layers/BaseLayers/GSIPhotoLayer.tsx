import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const GSIPhotoLayer = () => {
  return (
    <LayersControl.BaseLayer name='国土地理院 衛星写真'>
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto">国土地理院</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'
      />
    </LayersControl.BaseLayer>
  );
};
