import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from './handler/MapInitializer';
import { MapEventHandler } from './handler/MapEventHandler';
import { AdditionalControls } from './controls/AdditionalControls';
import { JapanPrefOverlayLayer } from './layers/GeoJSONLayers/JapanPrefOverlayLayer';
import { JapanCityOverlayLayer } from './layers/GeoJSONLayers/JapanCityOverlayLayer';
import { NowcastOverlayLayer } from './layers/OverlayLayers/NowcastOverlayLayer';
import { GSIReliefLayer } from './layers/OverlayLayers/GSIReliefLayer';
import { PopulationLayer } from './layers/OverlayLayers/PopulationLayer';
import { FireDeptLayers } from './layers/MarkerLayers/FireDeptMarkerLayers';
import { RiverLevelLayer } from './layers/MarkerLayers/RiverLevelMarkerLayer';
import { NewsCrisis } from './layers/MarkerLayers/NewsMarkerLayers';
import { LinkControl } from './controls/LinkControl';
import { CommonMapStyle } from './CommonMapStyle';
import { GSIHazardMapLayers } from './layers/OverlayLayers/GSIHazardMapLayers';
import { JMABoundaryLayer } from './layers/BaseLayers/JMABaseLayer';
import { JMARiskLayers } from './layers/OverlayLayers/JMARiskLayers';
import { BaseLayers } from './layers/BaseLayers';

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
        links={[
          {
            path: '/place/日本?category=crisis',
            title: '全国災害ニュース記事一覧',
          },
          {
            path: '/theme/solar',
            title: '全国メガソーラー情報地図',
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
          <Pane name='pref-city-overlay' style={{ zIndex: 500 }}>
            <JapanPrefOverlayLayer />
            <JapanCityOverlayLayer />
          </Pane>
          <Pane name='stat-overlay' style={{ zIndex: 500 }}>
            <GSIReliefLayer />
            <GSIHazardMapLayers />
            <PopulationLayer />
          </Pane>
          <Pane name='jma-overlay' style={{ zIndex: 600 }}>
            <JMARiskLayers />
          </Pane>
          <Pane name='rain-overlay' style={{ zIndex: 600 }}>
            <NowcastOverlayLayer />
          </Pane>
          <Pane name='boundary-overlay' style={{ zIndex: 1000 }}>
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
