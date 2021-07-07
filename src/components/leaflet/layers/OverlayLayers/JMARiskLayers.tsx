import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const LandslideRiskLayer = () => {
  const time = '20210706232000';
  const landslideUrl = `https://www.jma.go.jp/bosai/jmatile/data/risk/${time}/none/${time}/surf/land/{z}/{x}/{y}.png`;
  const inundateUrl = `https://www.jma.go.jp/bosai/jmatile/data/risk/${time}/none/${time}/surf/inund/{z}/{x}/{y}.png`;
  //const floodUrl = `https://www.jma.go.jp/bosai/jmatile/data/risk/${time}/none/${time}/surf/flood/{z}/{x}/{y}.pbf`;
  return (
    <>
      <AbstractOverlayLayer
        id='jma-landslide-overlay-layer'
        name='気象庁 キキクル 土砂災害危険度分布'
        attribution='<a href="https://www.jma.go.jp/">気象庁</a>'
        maxNativeZoom={11}
        url={landslideUrl}
        opacity={0.4}
      />
      <AbstractOverlayLayer
        id='jma-flood-overlay-layer'
        name='気象庁 キキクル 浸水危険度分布'
        attribution='<a href="https://www.jma.go.jp/">気象庁</a>'
        maxNativeZoom={11}
        url={inundateUrl}
        opacity={0.4}
      />
      {/*
      <AbstractOverlayLayer
        id='jma-landslide-overlay-layer'
        name='気象庁 キキクル 洪水危険度分布'
        attribution='<a href="https://www.jma.go.jp/">気象庁</a>'
        maxNativeZoom={11}
        url={floodUrl}
        opacity={0.3}
      />
        */}
    </>
  );
};
