import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
  const [url, setUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(true);
  const [country, setCountry] = useState('日本');
  useEffect(() => {
    const endpoint = '/api/news?';
    const params = new URLSearchParams();
    params.append('limit', '100');
    params.append('page', '0');
    // @ts-ignore
    params.append('category', category);
    if (country) {
      params.append('country', country);
    }
    setUrl(endpoint + params.toString());
  }, [category, checked, country]);

  useEffect(() => {
    if (checked) {
      setCountry('日本');
    } else {
      setCountry(null);
    }
  }, [checked]);

  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      <h1 css={tw`m-5 text-3xl font-bold`}>{category} 関連ニュース</h1>
      <div css={tw`text-xl inline ml-5`}>
        <input
          type='checkbox'
          id='placeCountry'
          value='japan'
          name='japan'
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        />
        <label htmlFor='placeCountry'>日本のみ</label>
      </div>
      {data?.map((news) => {
        const center = [news.latitude, news.longitude] as LatLngTuple;
        return (
          <div key={news.url} css={tw`my-10`}>
            <NewsView news={news} />
            {news.latitude && news.longitude && (
              <div css={tw`h-40 w-full`}>
                <StaticMap zoom={5} center={center} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NewsListView;
