import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

export const MegaSolarLayer = () => {
  const { data } = useSWR('/data/solar.json');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data.map((marker, i) => {
        const content = (
          <>
            <b>{marker.o}</b>
            <br />
            <b>{marker.n}</b>
          </>
        );
        return {
          center: [marker.lat, marker.lng],
          popupContent: content,
          id: 'mega-solar-' + i,
          icon: '/images/solar.png',
        };
      });
      setMarkers(newMarkers);
    }
  }, [data]);
  return (
    <AbstractMarkerLayer
      id='river-level-marker-layer'
      title='メガソーラー発電所'
      markers={markers}
    />
  );
};
