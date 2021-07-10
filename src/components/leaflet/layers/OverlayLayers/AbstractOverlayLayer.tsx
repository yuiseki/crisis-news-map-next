import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

interface AbstractOverlayLayerProps {
  id: string;
  name: string;
  attribution: string;
  url: string;
  maxNativeZoom?: number;
  maxZoom?: number;
  opacity?: number;
}

const AbstractOverlayLayer: React.VFC<AbstractOverlayLayerProps> = ({
  id,
  name,
  attribution,
  url,
  maxNativeZoom,
  maxZoom,
  opacity,
}: AbstractOverlayLayerProps) => {
  const overlays = JSON.parse(
    localStorage.getItem('leaflet-selected-overlays')
  );
  return (
    <LayersControl.Overlay
      key={id}
      name={name}
      checked={overlays ? overlays.indexOf(name) > -1 : true}
    >
      {url && (
        <TileLayer
          attribution={attribution}
          url={url}
          maxNativeZoom={maxNativeZoom}
          maxZoom={maxZoom}
          opacity={opacity}
        />
      )}
    </LayersControl.Overlay>
  );
};

export default AbstractOverlayLayer;
