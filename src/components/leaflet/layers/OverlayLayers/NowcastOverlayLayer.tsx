import React from 'react';
import { useJMANowcastTile } from '~/lib/useJMATile';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const NowcastOverlayLayer = () => {
  const url = useJMANowcastTile();
  return (
    <AbstractOverlayLayer
      id='nowcast-overlay-layer'
      name='気象庁 高解像度降水ナウキャスト'
      attribution='ナウキャスト'
      url={url}
      maxNativeZoom={10}
      opacity={0.4}
    />
  );
};
