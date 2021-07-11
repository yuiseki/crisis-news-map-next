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
import { getPlacePath, LocalNewsTitleView } from './LocalNewsTitleView';
import dynamic from 'next/dynamic';
import { getPlaceCenter } from '~/lib/getPlaceCenter';

const StaticMap = dynamic(() => import('./leaflet/StaticMap'), {
  ssr: false,
});

export const LocalNewsPage: React.VFC = () => {
  const router = useRouter();
  const { country, pref, city, category } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('ニュース記事');
  const [center, setCenter] = useState(null);

  useEffect(() => {
    setSelectedCategory(category as string);
  }, [category]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('hasLocation', 'true');
    params.append('limit', '100');
    params.append('page', '0');
    let title = '';
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
    if (selectedCategory !== undefined) {
      // @ts-ignore
      params.append('category', selectedCategory);
      // @ts-ignore
      title += newsCategories[selectedCategory] + '関連';
    }
    title += 'ニュース記事';
    setTitle(title);
    setCenter(getPlaceCenter(country, pref, city));
    setUrl('/api/news?' + params.toString());
  }, [country, pref, city, selectedCategory]);

  const { data } = useSWR<INews[]>(url);

  return (
    <>
      <Head>
        <title>全国災害情報地図 - {title}</title>
      </Head>
      <div>
        <h1 css={tw`m-5 text-3xl font-bold`}>
          <LocalNewsTitleView
            country={country}
            pref={pref}
            city={city}
            category={selectedCategory}
          />
          &nbsp;の
          {category && newsCategories[selectedCategory] + '関連'}
          ニュース記事
        </h1>
        <div css={tw`h-60 w-full my-4`}>
          <StaticMap zoom={7} center={center} />
        </div>
        <div>
          <h2 css={tw`text-xl inline ml-4`}>カテゴリ:</h2>
          {Object.keys(newsCategories).map((cat) => {
            return (
              <div key={cat} css={tw`text-xl inline ml-4`}>
                <input
                  type='radio'
                  id={cat}
                  value={cat}
                  name='category'
                  checked={cat === selectedCategory}
                  onChange={(e) => {
                    const path = getPlacePath(
                      country,
                      pref,
                      city,
                      e.target.value
                    );
                    router.push(path);
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
