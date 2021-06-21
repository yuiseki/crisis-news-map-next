import { LatLngTuple } from 'leaflet';
import React, { useEffect } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import tw from 'twin.macro';

const StaticMap: React.VFC<{ center: LatLngTuple }> = ({
  center,
}: {
  center: LatLngTuple;
}) => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  return (
    <div className='map' css={tw`h-full mx-auto m-0 p-0`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
};

export default StaticMap;
