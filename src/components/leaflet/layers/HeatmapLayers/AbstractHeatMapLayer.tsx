// Based on leaflet.heat

import React, { useEffect } from 'react';
import { heatLayer, LatLng } from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

export interface HeatMapLayerProps {
  points: LatLng[];
}

const HeatMapLayer: React.VFC<HeatMapLayerProps> = ({
  points,
}: HeatMapLayerProps) => {
  const map = useMap();
  const options = {
    minOpacity: 0.1,
    maxZoom: 10,
    radius: 10,
  };

  useEffect(() => {
    const heatMapLayer = heatLayer(points, options);
    map.addLayer(heatMapLayer);
    return () => {
      map.removeLayer(heatMapLayer);
    };
  }, [map, points]);
  return null;
};

export default HeatMapLayer;
