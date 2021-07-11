import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from './handler/MapInitializer';
import { MapEventHandler } from './handler/MapEventHandler';
import { AdditionalControls } from './controls/AdditionalControls';
import { LinkControl } from './controls/LinkControl';
import { CommonMapStyle } from './CommonMapStyle';
import { BaseLayers } from './layers/BaseLayers';
import { JMABoundaryLayer } from './layers/BaseLayers/JMABaseLayer';
import { JapanPrefGeoJSONLayer } from './layers/GeoJSONLayers/JapanPrefGeoJSONLayer';
import { JapanStationGeoJSONLayer } from './layers/GeoJSONLayers/JapanStationGeoJSONLayer';
import { FireDeptLayers } from './layers/MarkerLayers/FireDeptMarkerLayers';
import { RiverLevelLayer } from './layers/MarkerLayers/RiverLevelMarkerLayer';
import { NewsCrisis } from './layers/MarkerLayers/NewsMarkerLayers';
import { NowcastOverlayLayer } from './layers/OverlayLayers/NowcastOverlayLayer';
import { GSIReliefOverlayLayer } from './layers/OverlayLayers/GSIReliefOverlayLayer';
import { PopulationOverlayLayer } from './layers/OverlayLayers/PopulationOverlayLayer';
import { GSIHazardMapOverlayLayers } from './layers/OverlayLayers/GSIHazardMapOverlayLayers';
import { JMARiskOverlayLayers } from './layers/OverlayLayers/JMARiskOverlayLayers';

const CrisisMap = () => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: 'images/marker-icon-2x.png',
      iconUrl: 'images/marker-icon.png',
      shadowUrl: 'images/marker-shadow.png',
    });
  }, []);

  return (
    <div className='map' css={CommonMapStyle}>
      <LinkControl
        title='全国災害情報地図'
        links={[
          {
            path: '/place/日本?category=crisis',
            title: '全国災害ニュース記事一覧',
          },
          {
            path: '/theme/solar',
            title: '全国メガソーラー・盛り土情報地図',
          },
          { path: '/theme/covid19', title: '全国新型コロナウイルス情報地図' },
          { path: '/theme/poverty', title: '全世界貧困情報地図' },
          { path: '/theme/child', title: '全世界児童虐待情報地図' },
        ]}
      />
      <MapContainer
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapInitializer />
        <MapEventHandler />
        <LayersControl position='topright'>
          <BaseLayers />
          <Pane name='static-overlay' style={{ zIndex: 500 }}>
            <GSIReliefOverlayLayer />
            <GSIHazardMapOverlayLayers />
            <PopulationOverlayLayer />
            <JapanStationGeoJSONLayer />
          </Pane>
          <Pane name='realtime-base--overlay' style={{ zIndex: 600 }}>
            <JapanPrefGeoJSONLayer />
          </Pane>
          <Pane name='realtime-overlay' style={{ zIndex: 600 }}>
            <JMARiskOverlayLayers />
            <NowcastOverlayLayer />
          </Pane>
          <Pane name='boundary-overlay' style={{ zIndex: 600 }}>
            <JMABoundaryLayer />
          </Pane>
          <Pane name='marker-overlay' style={{ zIndex: 1000 }}>
            <FireDeptLayers />
            <RiverLevelLayer />
          </Pane>
          <Pane name='marker-cluster-overlay' style={{ zIndex: 1000 }}>
            <NewsCrisis />
          </Pane>
        </LayersControl>
        <AdditionalControls />
      </MapContainer>
    </div>
  );
};

export default CrisisMap;
