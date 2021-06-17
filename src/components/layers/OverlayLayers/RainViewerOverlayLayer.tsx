import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const RainViewerOverlayLayer = () => {
  const { data } = useSWR('https://tilecache.rainviewer.com/api/maps.json');
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (data) {
      const baseTime = data[0];
      const newUrl =
        'https://tilecache.rainviewer.com/v2/radar/' +
        baseTime +
        '/256/{z}/{x}/{y}/2/1_1.png';
      setUrl(newUrl);
    }
  }, [data]);
  return (
    <>
      {url && (
        <AbstractOverlayLayer
          id='nowcast-overlay-layer'
          name='RainViewer'
          attribution='RainViewer'
          url={url}
          opacity={0.8}
        />
      )}
    </>
  );
};
