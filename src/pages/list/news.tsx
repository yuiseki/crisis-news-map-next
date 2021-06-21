import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import React from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { NewsView } from '~/components/NewsView';
import { INews } from '~/models/News';

const StaticMap = dynamic(() => import('../../components/leaflet/StaticMap'), {
  ssr: false,
});

const NewsListView: React.VFC = () => {
  const url = `/api/news?hasLocation=true`;
  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      {data?.map((news) => {
        const center = [news.latitude, news.longitude] as LatLngTuple;
        return (
          <>
            <NewsView key={news.url} news={news} />
            <div css={tw`h-40 w-full`}>
              <StaticMap center={center} />
            </div>
          </>
        );
      })}
    </div>
  );
};

export default NewsListView;
