import { useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';

export const MapEventHandler = () => {
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
