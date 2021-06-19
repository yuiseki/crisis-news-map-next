import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

export const RiverLevelLayer = () => {
  const { data } = useSWR('/api/riverlevel');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data.map((marker) => {
        const updatedAt = new Date(Date.parse(marker.updatedAt.obsTime));
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
          id: marker.id,
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
      markers={markers}
    />
  );
};
