import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractPieChartLayer from './AbstractPieChartLayer';

export const Covid19VaccinePieChartLayer = () => {
  const { data } = useSWR('/api/vaccine');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data.map((marker) => {
        const content = (
          <>
            <b>{marker.pref}</b>
            <br />
            高齢者数：{marker.people}
            <br />
            接種完了者数：{marker.finished}
            <br />
            接種完了率：{marker.percentage}%
          </>
        );
        return {
          center: [marker.latitude, marker.longitude],
          popupContent: content,
          percentage: marker.percentage,
          id: marker.pref,
        };
      });
      setMarkers(newMarkers);
    }
  }, [data]);
  return (
    <AbstractPieChartLayer
      id='covid19-vaccine-pie-chart-layer'
      title='新型コロナワクチン接種率'
      markers={markers}
    />
  );
};
