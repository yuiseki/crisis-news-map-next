import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { NewsView } from '~/components/NewsView';
import { INews } from '~/models/News';

export const LocalNewsPage: React.VFC = () => {
  const router = useRouter();
  const { country, pref, city } = router.query;

  let title = '';
  const param = new URLSearchParams();
  param.append('hasLocation', 'true');
  param.append('category', 'crisis');
  if (country) {
    param.append('country', country as string);
    title += country;
  }
  if (pref) {
    param.append('pref', pref as string);
    title += ', ' + pref;
  }
  if (city) {
    param.append('city', city as string);
    title += ', ' + city;
  }

  const url = '/api/news?' + param.toString();
  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      <h1 css={tw`m-5 text-3xl font-bold`}>{title}</h1>
      {data?.map((news) => {
        return <NewsView key={news.url} news={news} />;
      })}
    </div>
  );
};
