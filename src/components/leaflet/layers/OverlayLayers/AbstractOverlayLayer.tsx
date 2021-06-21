import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

interface AbstractOverlayLayerProps {
  id: string;
  name: string;
  attribution: string;
  url: string;
  maxNativeZoom?: number;
  opacity?: number;
}

const AbstractOverlayLayer: React.VFC<AbstractOverlayLayerProps> = ({
  id,
  name,
  attribution,
  url,
  maxNativeZoom,
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
      <TileLayer
        attribution={attribution}
        url={url}
        maxNativeZoom={maxNativeZoom}
        opacity={opacity}
      />
    </LayersControl.Overlay>
  );
};

export default AbstractOverlayLayer;
