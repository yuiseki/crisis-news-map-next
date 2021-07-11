import React, { useCallback, useState } from 'react';
import { Layer } from 'leaflet';
import { LayersControl, GeoJSON, TileLayer } from 'react-leaflet';
import useSWR from 'swr';

interface AbstractGeoJSONLayerProps {
  id: string;
  name: string;
  url: string;
  attribution?: string;
  maxNativeZoom?: number;
  minNativeZoom?: number;
  style?: any;
  onEachFeature?: (feature, layer) => void | undefined;
  pointToLayer?: (point, latlng) => Layer | undefined;
}

const AbstractGeoJSONTileLayer: React.VFC<AbstractGeoJSONLayerProps> = ({
  id,
  name,
  url,
  attribution,
  style,
  maxNativeZoom,
  minNativeZoom,
  onEachFeature,
  pointToLayer,
}: AbstractGeoJSONLayerProps) => {
  const overlays = JSON.parse(
    localStorage.getItem('leaflet-selected-overlays')
  );
  const [tileUrl, setTileUrl] = useState(null);
  const { data } = useSWR(tileUrl);

  const onTileLoad = useCallback((event) => {
    if (!url) {
      return;
    }
    const tilePath = event.coords;
    const z = tilePath.z;
    const x = tilePath.x;
    const y = tilePath.y;
    const newTileUrl = url
      .replace('{z}', z)
      .replace('{x}', x)
      .replace('{y}', y);
    setTileUrl(newTileUrl);
  }, []);

  return (
    <>
      <TileLayer
        url={''}
        eventHandlers={{ tileloadstart: (e) => onTileLoad(e) }}
        maxNativeZoom={maxNativeZoom}
        minNativeZoom={minNativeZoom}
        minZoom={minNativeZoom}
      />
      <LayersControl.Overlay
        key={id}
        name={name}
        checked={overlays ? overlays.indexOf(name) > -1 : true}
      >
        {data && (
          <GeoJSON
            data={data.features}
            attribution={attribution}
            style={style}
            onEachFeature={onEachFeature}
            pointToLayer={pointToLayer}
          />
        )}
      </LayersControl.Overlay>
    </>
  );
};

export default AbstractGeoJSONTileLayer;
