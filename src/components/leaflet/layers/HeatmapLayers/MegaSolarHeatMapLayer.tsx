import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractHeatMapLayer from './AbstractHeatMapLayer';

export const MegaSolarHeatMapLayer = () => {
  const { data } = useSWR('/data/solar.json');
  const [points, setPoints] = useState([]);
  useEffect(() => {
    if (data) {
      const newPoints = data.map((d) => {
        return [d.lat, d.lng];
      });
      setPoints(newPoints);
    }
  }, [data]);
  return <AbstractHeatMapLayer points={points} />;
};
