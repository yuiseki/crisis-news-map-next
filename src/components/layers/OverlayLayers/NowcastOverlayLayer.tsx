import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const NowcastOverlayLayer = () => {
  const { data } = useSWR(
    'https://www.jma.go.jp/bosai/jmatile/data/nowc/targetTimes_N1.json'
  );
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (data) {
      const baseTime = data[0].basetime;
      const validTime = data[0].validtime;
      const newUrl =
        'https://www.jma.go.jp/bosai/jmatile/data/nowc/' +
        baseTime +
        '/none/' +
        validTime +
        '/surf/hrpns/{z}/{x}/{y}.png';
      setUrl(newUrl);
    }
  }, [data]);
  return (
    <>
      {url && (
        <AbstractOverlayLayer
          id='nowcast-overlay-layer'
          name='高解像度降水ナウキャスト'
          attribution='ナウキャスト'
          url={url}
        />
      )}
    </>
  );
};
