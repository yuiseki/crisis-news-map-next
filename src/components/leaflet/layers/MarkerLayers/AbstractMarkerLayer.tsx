import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import { LayersControl, Marker, Popup, LayerGroup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MarkerProps {
  center: LatLngTuple;
  popupContent: string;
  id: string;
  icon: string;
}
interface AbstractMarkerLayerProps {
  id: string;
  title: string;
  attribution?: string;
  markers: MarkerProps[];
}

const AbstractMarkerLayer: React.VFC<AbstractMarkerLayerProps> = ({
  id,
  title,
  attribution,
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
      <LayerGroup attribution={attribution}>
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
            <Marker key={marker.id} position={marker.center} icon={markerIcon}>
              <Popup>{marker.popupContent}</Popup>
            </Marker>
          );
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

export default AbstractMarkerLayer;
