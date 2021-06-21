import React from 'react';
import { renderToString } from 'react-dom/server';
import Leaflet, { LatLngTuple } from 'leaflet';
import { LayerGroup, LayersControl, Marker, Popup } from 'react-leaflet';
import { PieChartIcon } from './PieChartIcon';

export interface PieChartMarkerProps {
  center: LatLngTuple;
  popupContent: string;
  id: string;
  percentage: number;
}

interface AbstractPieChartLayerProps {
  id: string;
  title: string;
  markers: PieChartMarkerProps[];
}

const AbstractPieChartLayer: React.VFC<AbstractPieChartLayerProps> = ({
  id,
  title,
  markers,
}: AbstractPieChartLayerProps) => {
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
        {markers.map((marker) => {
          const iconMarkup = renderToString(
            <PieChartIcon percentage={marker.percentage} />
          );
          const markerIcon = new Leaflet.DivIcon({
            html: iconMarkup,
            className: '',
            iconSize: [60, 60],
            popupAnchor: [0, -30],
          });
          return (
            <Marker key={marker.id} position={marker.center} icon={markerIcon}>
              <Popup>{marker.popupContent}</Popup>
            </Marker>
          );
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

export default AbstractPieChartLayer;
