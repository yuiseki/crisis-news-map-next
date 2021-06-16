import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';
import { FireDeptOverlay } from './FireDeptLayers';

export const MyLayersControl = () => {
  const time = '20210613112000';
  const baseTime = time;
  const validTime = time;
  return (
    <LayersControl position='topright'>
      <LayersControl.BaseLayer checked name='OpenStreetMap'>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </LayersControl.BaseLayer>
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
      <LayersControl.Overlay name='国土地理院色別標高図'>
        <TileLayer
          attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>'
          url='https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
        />
      </LayersControl.Overlay>
      <FireDeptOverlay />
    </LayersControl>
  );
};
