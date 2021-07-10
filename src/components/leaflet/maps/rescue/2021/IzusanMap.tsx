import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import Leaflet from 'leaflet';
import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from '../../../handler/MapInitializer';
import { MapEventHandler } from '../../../handler/MapEventHandler';
import { AdditionalControls } from '../../../controls/AdditionalControls';
import { JapanPrefOverlayLayer } from '../../../layers/GeoJSONLayers/JapanPrefOverlayLayer';
import { JapanCityOverlayLayer } from '../../../layers/GeoJSONLayers/JapanCityOverlayLayer';
import { CommonMapStyle } from '../../../CommonMapStyle';
import { LinkControl } from '../../../controls/LinkControl';
import Head from 'next/head';
import { PopulationLayer } from '../../../layers/OverlayLayers/PopulationLayer';
import { GSIHazardMapLayers } from '../../../layers/OverlayLayers/GSIHazardMapLayers';
import { GSIReliefLayer } from '../../../layers/OverlayLayers/GSIReliefLayer';
import { NowcastOverlayLayer } from '~/components/leaflet/layers/OverlayLayers/NowcastOverlayLayer';
import { BaseLayers } from '~/components/leaflet/layers/BaseLayers';
import AbstractRescueGeoJSONLayer from '~/components/leaflet/layers/GeoJSONLayers/AbstractRescueGeoJSONLayer';
import AbstractGeoJSONLayer from '~/components/leaflet/layers/GeoJSONLayers/AbstractGeoJSONLayer';

const IzusnaRescueLayer = () => {
  return (
    <AbstractRescueGeoJSONLayer
      id='izusan-rescue-layer'
      name='2021年 静岡県熱海市伊豆山 土砂災害 災害支援情報'
      url='https://script.google.com/macros/s/AKfycbw0D0AjIFPBGbBXj3Zr5X1j_34fwIj8RSflwc6EJrDp97pMdRRnyNcMOOHvuRHZOslJdg/exec?confirmed=true'
    />
  );
};

const IzusanHazardLayer = () => {
  return (
    <>
      <AbstractGeoJSONLayer
        id='izusan-hazard-layer-1'
        name='2021年 静岡県熱海市伊豆山 土砂災害 被害状況 速報'
        url='https://maps.gsi.go.jp/xyz/20210705oame_atami_houkaichi/2/3/1.geojson'
      />
      <AbstractGeoJSONLayer
        id='izusan-hazard-layer-2'
        name='2021年 静岡県熱海市伊豆山 土砂災害 被害状況 第2報'
        url='https://maps.gsi.go.jp/xyz/20210705oame_atami_houkaichi2/2/3/1.geojson'
      />
      <AbstractGeoJSONLayer
        id='izusan-hazard-layer-3'
        name='2021年 静岡県熱海市伊豆山 土砂災害 被害状況 第3報'
        url='https://maps.gsi.go.jp/xyz/20210705oame_atami_houkaichi3/2/3/1.geojson'
      />
    </>
  );
};

const Map = () => {
  useEffect(() => {
    delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
    Leaflet.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  const title = '2021年 静岡県熱海市伊豆山 土砂災害 災害情報地図';
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
          ]}
        />
        <MapContainer
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer />
          <MapEventHandler />
          <AdditionalControls />
          <LayersControl position='topright'>
            <BaseLayers />
            <Pane name='pref-city-overlay' style={{ zIndex: 500 }}>
              <JapanPrefOverlayLayer />
              <JapanCityOverlayLayer />
            </Pane>
            <Pane name='stat-overlay' style={{ zIndex: 500 }}>
              <GSIReliefLayer />
              <PopulationLayer />
              <GSIHazardMapLayers />
            </Pane>
            <Pane name='rain-overlay' style={{ zIndex: 600 }}>
              <NowcastOverlayLayer />
            </Pane>
            <Pane name='marker-overlay' style={{ zIndex: 700 }}>
              <IzusnaRescueLayer />
            </Pane>
            <Pane name='hazard-overlay' style={{ zIndex: 700 }}>
              <IzusanHazardLayer />
            </Pane>
          </LayersControl>
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
