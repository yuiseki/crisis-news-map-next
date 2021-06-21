import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { INews } from '~/models/News';

const StaticMap = dynamic(() => import('../../components/StaticMap'), {
  ssr: false,
});

const NewsView: React.VFC<{ news: INews }> = ({ news }: { news: INews }) => {
  const center = [news.latitude, news.longitude] as LatLngTuple;
  return (
    <div css={tw`m-5`}>
      <a href={news.url}>
        <h2 css={tw`text-2xl font-bold`}>{news.ogTitle}</h2>
        <h3 css={tw`text-2xl`}>{news.url}</h3>
      </a>
      <div css={tw`text-xl my-1`}>
        <span css={tw`mr-1`}>
          {new Date(Date.parse(news.createdAt)).toLocaleString()}
        </span>
        <span css={tw`mr-1`}>
          {news.placeCountry}
          {news.placePref}
          {news.placeCity}
        </span>
        <span>{news.category}</span>
      </div>
      <div>{news.ogDesc}</div>
      <div css={tw`h-40 w-full`}>
        <StaticMap center={center} />
      </div>
    </div>
  );
};

const NewsListView: React.VFC = () => {
  const url = `/api/news?hasLocation=true`;
  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      {data?.map((news) => {
        return <NewsView key={news.url} news={news} />;
      })}
    </div>
  );
};

export default NewsListView;
