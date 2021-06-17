import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

export const RiverLevelLayer = () => {
  const { data } = useSWR('/api/riverlevel');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data.map((marker) => {
        const created_at = new Date(marker.created_at._seconds * 1000);
        const content = (
          <>
            <b>{marker.name}</b>
            <br />
            氾濫水位：{marker.fladLevel}
            <br />
            現在水位：{marker.level}
            <br />({created_at.toLocaleString()})
          </>
        );
        return {
          center: [marker.lat, marker.long],
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
