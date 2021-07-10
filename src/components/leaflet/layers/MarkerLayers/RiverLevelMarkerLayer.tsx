import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

export const RiverLevelLayer = () => {
  const { data } = useSWR('/api/riverlevel');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data.map((marker) => {
        const updatedAt = new Date(Date.parse(marker.updatedAt));
        const content = (
          <>
            <b>{marker.name}</b>
            <br />
            氾濫水位：{marker.fladLevel}
            <br />
            現在水位：{marker.level}
            <br />({updatedAt.toLocaleString()})
          </>
        );
        return {
          center: [marker.latitude, marker.longitude],
          popupContent: content,
          id: marker._id,
          icon: '/images/flood.png',
        };
      });
      setMarkers(newMarkers);
    }
  }, [data]);
  return (
    <AbstractMarkerLayer
      id='river-level-marker-layer'
      title='河川氾濫箇所'
      attribution='<a href="https://k.river.go.jp/">危機管理型水位計運用協議会, 一般財団法人河川情報センター</a>'
      markers={markers}
    />
  );
};
