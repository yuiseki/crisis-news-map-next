import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import { NewsView } from '~/components/NewsView';
import { newsCategories } from '~/lib/constants/newsCategories';
import { INews } from '~/models/News';
import { categories } from 'detect-categories-ja';

const StaticMap = dynamic(() => import('../../components/leaflet/StaticMap'), {
  ssr: false,
});

export const getNewsPath = (category, checked) => {
  let locationPath = '/news/' + category;
  if (checked) {
    locationPath += '?japanOnly=true';
  }
  return locationPath;
};

const NewsListView: React.VFC = () => {
  const router = useRouter();
  const { category, japanOnly } = router.query;
  const [words, setWords] = useState(['']);
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);
  const [country, setCountry] = useState('日本');

  useEffect(() => {
    if (japanOnly === 'true') {
      setChecked(true);
    }
  }, [japanOnly]);

  useEffect(() => {
    // @ts-ignore
    setTitle(newsCategories[category] + '関連ニュース記事');
    categories.map((cat) => {
      if (cat.id === category) {
        setWords(cat.words);
      }
    });
  }, [category]);

  useEffect(() => {
    const endpoint = '/api/news?';
    const params = new URLSearchParams();
    params.append('limit', '100');
    params.append('page', '0');
    if (category !== 'all') {
      // @ts-ignore
      params.append('category', category);
    }
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
      <h1 css={tw`m-5 text-3xl font-bold`}>{title}</h1>
      <div css={tw`text-xl inline ml-5`}>
        <input
          type='checkbox'
          id='placeCountry'
          value='japan'
          name='japan'
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            const path = getNewsPath(category, e.target.checked);
            router.push(path);
          }}
        />
        <label htmlFor='placeCountry'>日本のみ</label>
      </div>
      <div css={tw`text-xl ml-4`}>
        <h2>カテゴリ：</h2>
        {Object.keys(newsCategories).map((cat) => {
          return (
            <>
              {cat === 'poverty' && <br />}
              <div key={cat} css={tw`inline mr-4`}>
                <input
                  type='radio'
                  id={cat}
                  value={cat}
                  name='category'
                  checked={cat === category}
                  onChange={(e) => {
                    const path = getNewsPath(e.target.value, checked);
                    router.push(path);
                  }}
                />
                <label htmlFor={cat}>{newsCategories[cat]}</label>
              </div>
            </>
          );
        })}
      </div>
      <div css={tw`ml-4 my-4`}>
        <h3>判定ワード：</h3>
        {words.map((word) => {
          return <span key={word}>{word} ,</span>;
        })}
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
