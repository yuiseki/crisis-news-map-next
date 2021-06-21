import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

export const OSMBaseLayer = () => {
  return (
    <LayersControl.BaseLayer checked name='OpenStreetMap'>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </LayersControl.BaseLayer>
  );
};
