import React, { useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Leaflet from 'leaflet';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

interface AbstractRescueGeoJSONLayerProps {
  id: string;
  name: string;
  url: string;
}
const AbstractRescueGeoJSONLayer = ({
  id,
  name,
  url,
}: AbstractRescueGeoJSONLayerProps) => {
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
      <div style={{ width: 50, height: 50, backgroundColor: 'lightgray' }}>
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
      id={id}
      name={name}
      url={url}
      pointToLayer={pointToLayer}
    />
  );
};

export default AbstractRescueGeoJSONLayer;
