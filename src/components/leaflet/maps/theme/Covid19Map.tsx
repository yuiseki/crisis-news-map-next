import Head from 'next/head';
import React, { useEffect } from 'react';
import Leaflet from 'leaflet';
import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from '../../handler/MapInitializer';
import { MapEventHandler } from '../../handler/MapEventHandler';
import { AdditionalControls } from '../../controls/AdditionalControls';
import { LinkControl } from '../../controls/LinkControl';
import { NewsVirus } from '../../layers/MarkerLayers/NewsMarkerLayers';
import { Covid19VaccinePieChartLayer } from '../../layers/PieChartLayers/Covid19VaccinePieChartLayer';
import { CommonMapStyle } from '../../CommonMapStyle';
import { BaseLayers } from '../../layers/BaseLayers';

const CrisisMap = () => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  const title = '全国新型コロナウイルス情報地図';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='map' css={CommonMapStyle}>
        <LinkControl
          title={title}
          links={[
            {
              path: '/',
              title: '全国災害情報地図',
            },
            {
              path: '/',
              title: '全国メガソーラー・盛り土情報地図',
            },
          ]}
        />
        <MapContainer
          scrollWheelZoom={true}
          maxZoom={22}
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer />
          <MapEventHandler />
          <AdditionalControls />
          <LayersControl position='topright'>
            <BaseLayers />
            <Pane name='pie-chart-overlay' style={{ zIndex: 700 }}>
              <Covid19VaccinePieChartLayer />
            </Pane>
            <Pane name='marker-cluster-overlay' style={{ zIndex: 800 }}>
              <NewsVirus />
            </Pane>
          </LayersControl>
        </MapContainer>
      </div>
    </>
  );
};

export default CrisisMap;
