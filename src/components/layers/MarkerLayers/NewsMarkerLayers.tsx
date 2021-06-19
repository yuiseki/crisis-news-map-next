import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

interface AbstractNewsProps {
  id: string;
  title: string;
  category: string;
  icon: string;
}

const AbstractNews = ({ id, title, category, icon }: AbstractNewsProps) => {
  const { data } = useSWR('/api/news');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data
        .filter((marker) => {
          return (
            marker.category === category && marker.latitude && marker.longitude
          );
        })
        .map((marker) => {
          return {
            center: [marker.latitude, marker.longitude],
            popupContent: marker.ogTitle + ' ' + marker.ogDesc,
            id: marker.url ?? Math.random(),
            icon: icon,
          };
        });
      if (newMarkers.length > 0) {
        setMarkers(newMarkers);
      }
    }
  }, [data]);
  return <AbstractMarkerLayer id={id} title={title} markers={markers} />;
};

const NewsCrisis = () => {
  return (
    <AbstractNews
      id='news-crisis'
      title='災害ニュース'
      category='crisis'
      icon='/images/news_icon.png'
    />
  );
};

const NewsVirus = () => {
  return (
    <AbstractNews
      id='news-virus'
      title='感染症ニュース'
      category='virus'
      icon='/images/news_icon.png'
    />
  );
};

export const NewsMarkerLayers = () => {
  return (
    <>
      <NewsCrisis />
      <NewsVirus />
    </>
  );
};
