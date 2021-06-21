import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { NewsView } from '~/components/NewsView';
import { INews } from '~/models/News';

const StaticMap = dynamic(() => import('../../components/leaflet/StaticMap'), {
  ssr: false,
});

const NewsListView: React.VFC = () => {
  const router = useRouter();
  const { category } = router.query;
  const url = `/api/news?hasLocation=true&category=${category}`;
  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      {data?.map((news) => {
        const center = [news.latitude, news.longitude] as LatLngTuple;
        return (
          <div key={news.url} css={tw`my-10`}>
            <NewsView news={news} />
            <div css={tw`h-40 w-full`}>
              <StaticMap zoom={5} center={center} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsListView;
