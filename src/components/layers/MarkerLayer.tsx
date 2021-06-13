import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import { LayersControl, Marker, Popup, LayerGroup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MarkerProps {
  center: LatLngTuple;
  text: string;
  id: string;
  icon: string;
}
interface MarkerLayerProps {
  id: string;
  title: string;
  markers: MarkerProps[];
}

const MarkerLayer: React.VFC<MarkerLayerProps> = ({
  id,
  title,
  markers,
}: MarkerLayerProps) => {
  const [overlays, setOverlays] = useState([]);
  useEffect(() => {
    const selectedOverlays = JSON.parse(
      localStorage.getItem('leaflet-selected-overlays')
    );
    setOverlays(selectedOverlays);
  }, []);
  return (
    <LayersControl.Overlay
      key={id}
      name={title}
      checked={overlays.indexOf(title) > -1}
    >
      <LayerGroup>
        {markers.map((marker) => {
          const iconMarkup = renderToStaticMarkup(
            <img src={marker.icon} width={40} height={40} />
          );
          const markerIcon = new Leaflet.DivIcon({
            html: iconMarkup,
            className: '',
          });
          return (
            <Marker key={marker.id} position={marker.center} icon={markerIcon}>
              <Popup>{marker.text}</Popup>
            </Marker>
          );
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

export default MarkerLayer;
