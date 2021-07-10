import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from '../../handler/MapInitializer';
import { MapEventHandler } from '../../handler/MapEventHandler';
import { AdditionalControls } from '../../controls/AdditionalControls';
import { OSMBaseLayer } from '../../layers/BaseLayers/OSMBaseLayer';
import { GSIBaseLayer } from '../../layers/BaseLayers/GSIBaseLayer';
import { JapanPrefOverlayLayer } from '../../layers/GeoJSONLayers/JapanPrefOverlayLayer';
import { JapanCityOverlayLayer } from '../../layers/GeoJSONLayers/JapanCityOverlayLayer';
import { NewsChild } from '../../layers/MarkerLayers/NewsMarkerLayers';
import { Follow, Share } from 'react-twitter-widgets';
import { CommonMapStyle } from '../../CommonMapStyle';
import { LinkControl } from '../../controls/LinkControl';
import Head from 'next/head';
import { JMABaseLayer } from '../../layers/BaseLayers/JMABaseLayer';

const CrisisMap = () => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  return (
    <>
      <Head>
        <title>全世界児童虐待情報地図</title>
      </Head>
      <div className='map' css={CommonMapStyle}>
        <Follow username='yuiseki_' />
        <Share url={window.location.href} />
        <LinkControl path='/' title='全国災害情報地図' />
        <MapContainer
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer />
          <MapEventHandler />
          <AdditionalControls />
          <LayersControl position='topright'>
            <OSMBaseLayer />
            <GSIBaseLayer />
            <JMABaseLayer />
            <Pane name='pref-city-overlay' style={{ zIndex: 500 }}>
              <JapanPrefOverlayLayer />
              <JapanCityOverlayLayer />
            </Pane>
            <Pane name='marker-cluster-overlay' style={{ zIndex: 700 }}>
              <NewsChild />
            </Pane>
          </LayersControl>
        </MapContainer>
      </div>
    </>
  );
};

export default CrisisMap;
