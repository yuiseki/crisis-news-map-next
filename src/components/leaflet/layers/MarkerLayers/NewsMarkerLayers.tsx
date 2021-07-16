import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { LocalNewsTitleView } from '~/components/LocalNewsTitleView';
import AbstractMarkerClusterLayer from './AbstractMarkerClusterLayer';

interface AbstractNewsProps {
  id: string;
  title: string;
  category: string;
  icon: string;
}

const AbstractNews = ({ id, title, category, icon }: AbstractNewsProps) => {
  const url = `/api/news?limit=500&confirmed=true&hasLocation=true&country=日本&category=${category}`;
  const { data } = useSWR(url);
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
          const content = (
            <>
              <b css={tw`text-xl`}>
                <LocalNewsTitleView
                  country={marker.placeCountry}
                  pref={marker.placePref}
                  city={marker.placeCity}
                  category={marker.category}
                />
              </b>
              <br />
              <a href={marker.ogUrl} target='_target'>
                <b css={tw`text-xl`}>{marker.ogTitle}</b>
                <br />
                {marker.ogDesc && <span>{marker.ogDesc}</span>}
                <br />
                {marker.ogImage && <img src={marker.ogImage} />}
              </a>
            </>
          );
          return {
            center: [marker.latitude, marker.longitude],
            popupContent: content,
            id: marker.url ?? Math.random(),
            icon: icon,
          };
        });
      if (newMarkers.length > 0) {
        setMarkers(newMarkers);
      }
    }
  }, [data]);
  return <AbstractMarkerClusterLayer id={id} title={title} markers={markers} />;
};

export const NewsCrisis = () => {
  return (
    <AbstractNews
      id='news-crisis'
      title='災害ニュース'
      category='crisis'
      icon='/images/news_icon.png'
    />
  );
};

export const NewsVirus = () => {
  return (
    <AbstractNews
      id='news-virus'
      title='感染症ニュース'
      category='virus'
      icon='/images/news_icon.png'
    />
  );
};

export const NewsChild = () => {
  return (
    <AbstractNews
      id='news-child'
      title='児童虐待ニュース'
      category='child_abuse'
      icon='/images/news_icon.png'
    />
  );
};

export const NewsPoverty = () => {
  return (
    <AbstractNews
      id='news-poverty'
      title='貧困ニュース'
      category='poverty'
      icon='/images/news_icon.png'
    />
  );
};
