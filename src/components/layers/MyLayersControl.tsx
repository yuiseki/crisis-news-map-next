import React from 'react';
import { LayersControl } from 'react-leaflet';
import { FireDeptLayers } from './MarkerLayers/FireDeptMarkerLayers';
import { GSIBaseLayer } from './BaseLayers/GSIBaseLayer';
import { GsiReliefOverlayLayer } from './OverlayLayers/GsiReliefOverlayLayer';
import { NowcastOverlayLayer } from './OverlayLayers/NowcastOverlayLayer';
import { OSMBaseLayer } from './BaseLayers/OSMBaseLayer';
import { JapanPrefOverlayLayer } from './GeoJSONLayers/JapanPrefOverlayLayer';
import { JapanCityOverlayLayer } from './GeoJSONLayers/JapanCityOverlayLayer';

export const MyLayersControl = () => {
  return (
    <LayersControl position='topright'>
      <h2>地図</h2>
      <JapanPrefOverlayLayer />
      <JapanCityOverlayLayer />
      <OSMBaseLayer />
      <GSIBaseLayer />
      <hr />
      <NowcastOverlayLayer />
      <GsiReliefOverlayLayer />
      <FireDeptLayers />
    </LayersControl>
  );
};
