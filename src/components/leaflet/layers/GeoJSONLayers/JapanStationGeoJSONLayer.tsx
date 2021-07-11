import React from 'react';
import AbstractGeoJSONLayer from './AbstractGeoJSONLayer';

export const JapanStationGeoJSONLayer = () => {
  const onEachFeature = (feature, layer) => {
    if (feature.properties.name) {
      layer.bindTooltip(feature.properties.name);
    } else if (feature.properties.N02_005) {
      layer.bindTooltip(
        feature.properties.N02_004 +
          '<br />' +
          feature.properties.N02_003 +
          '<br />' +
          feature.properties.N02_005 +
          '駅'
      );
    }
  };
  const styleFunction = (feature) => {
    let color = 'lightblue';
    if (feature.properties.color) {
      color = '#' + feature.properties.color;
    } else {
      const h = Math.random() * 360;
      color = `hsl(${h}, 60%, 50%)`;
    }
    return {
      weight: 4,
      opacity: 1,
      fillOpacity: 1,
      color: color,
    };
  };
  return (
    <>
      <AbstractGeoJSONLayer
        id='japan-railway-overlay-layer'
        name='鉄道路線'
        attribution='<a href="https://uedayou.net/jrslod/">鉄道駅LOD</a>'
        url='/data/uedayou.net/jrslod.geojson'
        style={styleFunction}
        onEachFeature={onEachFeature}
      />
      <AbstractGeoJSONLayer
        id='japan-station-overlay-layer'
        name='鉄道駅'
        attribution='<a href="https://nlftp.mlit.go.jp/ksj/index.html">国土数値情報</a>'
        url='/data/nlftp.mlit.go.jp/N02-20_Station.geojson'
        style={{ radius: 10, weight: 10 }}
        onEachFeature={onEachFeature}
      />
    </>
  );
};
