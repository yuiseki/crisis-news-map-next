import { MapContainer } from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapInitializer } from './handler/MapInitializer';
import { MapEventHandler } from './handler/MapEventHandler';
import { AdditionalControls } from './controls/AdditionalControls';
import { MyLayersControl } from './layers/MyLayersControl';

const Map = () => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: 'images/marker-icon-2x.png',
      iconUrl: 'images/marker-icon.png',
      shadowUrl: 'images/marker-shadow.png',
    });
  }, []);
  return (
    <MapContainer
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <MapInitializer />
      <MapEventHandler />
      <AdditionalControls />
      <MyLayersControl />
    </MapContainer>
  );
};

export default Map;
