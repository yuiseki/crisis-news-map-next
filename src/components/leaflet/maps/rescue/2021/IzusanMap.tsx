import { LayersControl, MapContainer, Pane } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import React, { useCallback, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { MapInitializer } from '../../../handler/MapInitializer';
import { MapEventHandler } from '../../../handler/MapEventHandler';
import { AdditionalControls } from '../../../controls/AdditionalControls';
import { OSMBaseLayer } from '../../../layers/BaseLayers/OSMBaseLayer';
import { GSIBaseLayer } from '../../../layers/BaseLayers/GSIBaseLayer';
import { JapanPrefOverlayLayer } from '../../../layers/GeoJSONLayers/JapanPrefOverlayLayer';
import { JapanCityOverlayLayer } from '../../../layers/GeoJSONLayers/JapanCityOverlayLayer';
import { CommonMapStyle } from '../../../CommonMapStyle';
import { LinkControl } from '../../../controls/LinkControl';
import Head from 'next/head';
import { PopulationLayer } from '../../../layers/OverlayLayers/PopulationLayer';
import { GSIHazardMapLayers } from '../../../layers/OverlayLayers/GSIHazardMapLayers';
import { GSIReliefLayer } from '../../../layers/OverlayLayers/GSIReliefLayer';
import { NowcastOverlayLayer } from '~/components/leaflet/layers/OverlayLayers/NowcastOverlayLayer';
import AbstractGeoJSONLayer from '~/components/leaflet/layers/GeoJSONLayers/AbstractGeoJSONLayer';
import { JMABaseLayer } from '~/components/leaflet/layers/BaseLayers/JMABaseLayer';

const IzusnaRescueLayer = () => {
  const pointToLayer = useCallback((point, latlng) => {
    const name = point.properties.name;
    const category = point.properties.category;
    let iconUrl = '/images/marker-icon.png';
    switch (category) {
      case '避難所':
        iconUrl = '/images/shelter.png';
        break;
      case '給水所':
        iconUrl = '/images/water.png';
        break;
      case '入浴施設':
        iconUrl = '/images/ofuro.png';
        break;
      case '無料Wi-Fi':
        iconUrl = '/images/wifi.png';
        break;
      case '携帯充電':
        iconUrl = '/images/electric_power.png';
        break;
      case '車両通行止め':
        iconUrl = '/images/traffic_cancel.png';
        break;
      case 'バス運行見合わせ':
        break;
      case '鉄道運行見合わせ':
        break;
      default:
        break;
    }
    const iconMarkup = renderToStaticMarkup(
      <div style={{ width: 50, height: 50 }}>
        <img src={iconUrl} width={50} height={50} />
      </div>
    );
    const markerIcon = new Leaflet.DivIcon({
      html: iconMarkup,
      className: '',
    });
    return Leaflet.marker(latlng, { icon: markerIcon }).bindPopup(
      name + ':' + category
    );
  }, []);
  return (
    <AbstractGeoJSONLayer
      id='izusan-rescue-layer'
      name='2021年 静岡県熱海市伊豆山 土砂崩れ 災害情報'
      url='https://script.google.com/macros/s/AKfycbw0D0AjIFPBGbBXj3Zr5X1j_34fwIj8RSflwc6EJrDp97pMdRRnyNcMOOHvuRHZOslJdg/exec?confirmed=true'
      style={{ weight: 5, opacity: 0.5, fillOpacity: 0.05 }}
      pointToLayer={pointToLayer}
    />
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
  return (
    <>
      <Head>
        <title>2021年 静岡県熱海市伊豆山 土砂崩れ 災害情報地図</title>
      </Head>
      <div className='map' css={CommonMapStyle}>
        <LinkControl
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
            <OSMBaseLayer />
            <GSIBaseLayer />
            <JMABaseLayer />
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
          </LayersControl>
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
