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
}) as React.FC;

export const getNewsPath = (category, checked, confirmed) => {
  const locationPath = '/news/' + category + '?';
  const params = new URLSearchParams();
  if (checked) {
    params.append('japan', 'true');
  }
  if (!confirmed) {
    params.append('confirmed', 'false');
  }
  return locationPath + params.toString();
};

const NewsListView: React.VFC = () => {
  const router = useRouter();
  const { category, japan, confirmed } = router.query;
  const [words, setWords] = useState(['']);
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [onlyJapan, setOnlyJapan] = useState(false);
  const [onlyConfirmed, setOnlyConfirmed] = useState(true);
  const [country, setCountry] = useState('日本');

  useEffect(() => {
    if (japan === 'true') {
      setOnlyJapan(true);
    } else {
      setOnlyJapan(false);
    }
  }, [japan]);

  useEffect(() => {
    if (confirmed === 'false') {
      setOnlyConfirmed(false);
    } else {
      setOnlyConfirmed(true);
    }
  }, [confirmed]);

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
    params.append('page', '1');
    if (category !== 'all') {
      // @ts-ignore
      params.append('category', category);
    }
    if (country) {
      params.append('country', country);
    }
    if (onlyConfirmed) {
      params.append('confirmed', 'true');
    }
    setUrl(endpoint + params.toString());
  }, [category, onlyJapan, country, onlyConfirmed]);

  useEffect(() => {
    if (onlyJapan) {
      setCountry('日本');
    } else {
      setCountry(null);
    }
  }, [onlyJapan]);

  const { data } = useSWR<INews[]>(url);
  return (
    <div>
      <h1 css={tw`m-5 text-3xl font-bold`}>{title}</h1>
      <div css={tw`text-2xl inline m-5`}>
        <span css={tw`mr-4`}>
          <input
            type='checkbox'
            id='placeCountry'
            value='日本'
            name='日本'
            checked={onlyJapan}
            onChange={(e) => {
              setOnlyJapan(e.target.checked);
              const path = getNewsPath(
                category,
                e.target.checked,
                onlyConfirmed
              );
              router.push(path);
            }}
          />
          <label htmlFor='placeCountry'>日本のみ</label>
        </span>
        <span css={tw`mr-4`}>
          <input
            type='checkbox'
            id='onlyConfirmed'
            value='マスメディアのみ'
            name='マスメディアのみ'
            checked={onlyConfirmed}
            onChange={(e) => {
              setOnlyConfirmed(e.target.checked);
              const path = getNewsPath(category, onlyJapan, e.target.checked);
              router.push(path);
            }}
          />
          <label htmlFor='onlyConfirmed'>マスメディアのみ</label>
        </span>
      </div>
      <div css={tw`text-xl m-5`}>
        <h2>カテゴリ：</h2>
        {Object.keys(newsCategories).map((cat) => {
          return (
            <>
              {cat === 'poverty' && <br />}
              <div key={cat} css={tw`inline mr-2`}>
                <input
                  type='radio'
                  id={cat}
                  value={cat}
                  name='category'
                  checked={cat === category}
                  onChange={(e) => {
                    const path = getNewsPath(
                      e.target.value,
                      onlyJapan,
                      onlyConfirmed
                    );
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
