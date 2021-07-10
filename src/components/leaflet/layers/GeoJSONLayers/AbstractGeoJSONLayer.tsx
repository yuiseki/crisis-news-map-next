import { Layer } from 'leaflet';
import React from 'react';
import { LayersControl, GeoJSON } from 'react-leaflet';
import useSWR from 'swr';

interface AbstractGeoJSONLayerProps {
  id: string;
  name: string;
  url: string;
  style?: any;
  onEachFeature?: (feature, layer) => void | undefined;
  pointToLayer?: (point, latlng) => Layer | undefined;
}

const AbstractGeoJSONLayer: React.VFC<AbstractGeoJSONLayerProps> = ({
  id,
  name,
  url,
  style,
  onEachFeature,
  pointToLayer,
}: AbstractGeoJSONLayerProps) => {
  const overlays = JSON.parse(
    localStorage.getItem('leaflet-selected-overlays')
  );
  const { data } = useSWR(url);
  return (
    <LayersControl.Overlay
      key={id}
      name={name}
      checked={overlays ? overlays.indexOf(name) > -1 : true}
    >
      {data && (
        <GeoJSON
          data={data.features}
          style={style}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
        />
      )}
    </LayersControl.Overlay>
  );
};

export default AbstractGeoJSONLayer;
