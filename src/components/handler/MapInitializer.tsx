import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

export const MapInitializer = () => {
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
    // @ts-ignore
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
};
