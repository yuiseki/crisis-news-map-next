//import { LatLngTuple } from 'leaflet';
//import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { NewsView } from '~/components/NewsView';
import { newsCategories } from '~/lib/constants/newsCategories';
import { INews } from '~/models/News';

/*
const StaticMap = dynamic(() => import('./leaflet/StaticMap'), {
  ssr: false,
});
*/

export const LocalNewsPage: React.VFC = () => {
  const router = useRouter();
  const { country, pref, city, category } = router.query;
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('ニュース記事');

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  useEffect(() => {
    let title = '';
    //const center = [36.5748441, 139.2394179] as LatLngTuple;
    const params = new URLSearchParams();
    params.append('hasLocation', 'true');
    params.append('limit', '100');
    params.append('page', '0');
    if (country) {
      params.append('country', country as string);
      title += country;
    }
    if (pref) {
      params.append('pref', pref as string);
      title += ', ' + pref;
    }
    if (city) {
      params.append('city', city as string);
      title += ', ' + city;
    }
    title += 'の';
    if (selectedCategory !== undefined && selectedCategory.length > 0) {
      // @ts-ignore
      params.append('category', selectedCategory);
      // @ts-ignore
      title += newsCategories[selectedCategory] + '関連';
    }
    title += 'ニュース記事';
    setTitle(title);

    setUrl('/api/news?' + params.toString());
  }, [selectedCategory]);
  const { data } = useSWR<INews[]>(url);

  return (
    <>
      <Head>
        <title>全国災害情報地図 - {title}</title>
      </Head>
      <div>
        <h1 css={tw`m-5 text-3xl font-bold`}>{title}</h1>
        {/**
        <div css={tw`h-80 w-full my-4`}>
          <StaticMap zoom={5} center={center} />
        </div>
           */}
        <div>
          <h2 css={tw`text-xl inline ml-4`}>カテゴリ:</h2>
          {Object.keys(newsCategories).map((cat) => {
            return (
              <div key={cat} css={tw`text-xl inline ml-4`}>
                <input
                  type='radio'
                  id={cat}
                  value={cat}
                  name={cat}
                  checked={cat === selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                />
                <label htmlFor={cat}>{newsCategories[cat]}</label>
              </div>
            );
          })}
        </div>
        {data?.map((news) => {
          return <NewsView key={news.url} news={news} />;
        })}
      </div>
    </>
  );
};
