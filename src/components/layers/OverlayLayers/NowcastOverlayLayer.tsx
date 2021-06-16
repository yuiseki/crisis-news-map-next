import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const NowcastOverlayLayer = () => {
  const time = '20210613112000';
  const baseTime = time;
  const validTime = time;
  const url =
    'https://www.jma.go.jp/bosai/jmatile/data/nowc/' +
    baseTime +
    '/none/' +
    validTime +
    '/surf/hrpns/{z}/{x}/{y}.png';
  return (
    <AbstractOverlayLayer
      id='nowcast-overlay-layer'
      name='ナウキャスト'
      attribution='ナウキャスト'
      url={url}
    />
  );
};
