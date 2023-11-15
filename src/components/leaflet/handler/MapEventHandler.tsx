import { useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';

export const MapEventHandler = () => {
  const saveMapState = useCallback((map) => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    // eslint-disable-next-line no-console
    console.log(center, zoom);
    try {
      localStorage.setItem('leaflet-center-lat', center.lat);
      localStorage.setItem('leaflet-center-lng', center.lng);
      localStorage.setItem('leaflet-zoom', zoom);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const saveOverlayState = useCallback((event) => {
    let selectedOverlays = null;
    try {
      selectedOverlays = JSON.parse(
        localStorage.getItem('leaflet-selected-overlays')
      );
    } catch (error) {
      console.error(error);
    }
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
