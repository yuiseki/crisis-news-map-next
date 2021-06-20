import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { LayersControl, Marker, Popup, LayerGroup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

interface MarkerProps {
  center: LatLngTuple;
  popupContent: string;
  id: string;
  icon: string;
}
interface AbstractMarkerLayerProps {
  id: string;
  title: string;
  markers: MarkerProps[];
}

const AbstractMarkerLayer: React.VFC<AbstractMarkerLayerProps> = ({
  id,
  title,
  markers,
}: AbstractMarkerLayerProps) => {
  const overlays = JSON.parse(
    localStorage.getItem('leaflet-selected-overlays')
  );
  return (
    <LayersControl.Overlay
      key={id}
      name={title}
      checked={overlays ? overlays.indexOf(title) > -1 : true}
    >
      <LayerGroup>
        <MarkerClusterGroup>
          {markers.map((marker) => {
            const iconMarkup = renderToStaticMarkup(
              <div style={{ width: 30, height: 30 }}>
                <img src={marker.icon} width={30} height={30} />
              </div>
            );
            const markerIcon = new Leaflet.DivIcon({
              html: iconMarkup,
              className: '',
            });
            return (
              <Marker
                key={marker.id}
                position={marker.center}
                icon={markerIcon}
              >
                <Popup>{marker.popupContent}</Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

export default AbstractMarkerLayer;
