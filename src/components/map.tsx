import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useCallback, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  FireDeptCrisis,
  FireDeptFire,
  FireDeptOther,
  FireDeptRescue,
} from './layers/FireDeptLayers';
import { ExpandControl } from './controls/ExpandControl';
import { LocateControl } from './controls/LocateControl';
import { GitHubControl } from './controls/GitHubControl';

const MapInitializer = () => {
  const map = useMap();
  const [center, setCenter] = useState([36.57142382346277, 132.31701507110336]);
  const [zoom, setZoom] = useState(6);
  useEffect(() => {
    // center
    const lat = localStorage.getItem('leaflet-center-lat');
    const lng = localStorage.getItem('leaflet-center-lng');
    if (!lat || !lng || lat === '0' || lng === '0') {
      return;
    }
    setCenter([Number(lat), Number(lng)]);
    // zoom
    const zoom = localStorage.getItem('leaflet-zoom');
    if (!zoom || zoom === '0') {
      return;
    }
    setZoom(Number(zoom));
  }, []);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(center, zoom);
    // @ts-ignore
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
};

const MapEventHandler = () => {
  const saveMapState = useCallback((map) => {
    const center = map.getCenter();
    localStorage.setItem('leaflet-center-lat', center.lat);
    localStorage.setItem('leaflet-center-lng', center.lng);
    localStorage.setItem('leaflet-zoom', map.getZoom());
  }, []);
  const saveOverlayState = useCallback((event) => {
    let selectedOverlays = JSON.parse(
      localStorage.getItem('leaflet-selected-overlays')
    );
    // eslint-disable-next-line no-console
    console.log(selectedOverlays);
    if (selectedOverlays === null) {
      selectedOverlays = [];
    }
    switch (event.type) {
      case 'overlayadd':
        if (selectedOverlays.indexOf(event.name) === -1) {
          selectedOverlays.push(event.name);
        }
        break;
      case 'overlayremove':
        if (selectedOverlays.indexOf(event.name) > -1) {
          selectedOverlays.splice(selectedOverlays.indexOf(event.name), 1);
        }
        break;
      default:
        break;
    }
    localStorage.setItem(
      'leaflet-selected-overlays',
      JSON.stringify(selectedOverlays)
    );
  }, []);
  const map = useMapEvents({
    dragend: () => saveMapState(map),
    zoomend: () => saveMapState(map),
    overlayadd: (e) => saveOverlayState(e),
    overlayremove: (e) => saveOverlayState(e),
  });
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FireDept = () => {
  return (
    <>
      <FireDeptCrisis />
      <FireDeptFire />
      <FireDeptRescue />
      <FireDeptOther />
    </>
  );
};

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
      <GitHubControl position='bottomleft' />
      <ExpandControl position='bottomright' />
      <LocateControl position='bottomright' />
      <LayersControl position='bottomright'>
        <LayersControl.BaseLayer checked name='OpenStreetMap'>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name='国土地理院色別標高図'>
          <TileLayer
            attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>'
            url='https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
          />
        </LayersControl.BaseLayer>
        {
          // <FireDept />
        }
      </LayersControl>
    </MapContainer>
  );
};

export default Map;
