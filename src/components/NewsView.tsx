import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import { INews } from '~/models/News';
import { newsCategories } from '~/lib/constants/newsCategories';
import { LocalNewsTitleView } from './LocalNewsTitleView';

export const NewsView: React.VFC<{ news: INews }> = ({
  news,
}: {
  news: INews;
}) => {
  const categoryPath = `/news/${news.category}`;

  return (
    <div css={tw`m-5 p-5 bg-gray-200`}>
      <div>
        <a
          href={news.url}
          css={tw`break-all text-blue-600 visited:text-purple-600`}
          target='_blank'
          rel='noreferrer'
        >
          <h2 css={tw`text-2xl font-bold`}>{news.ogTitle}</h2>
          <h3 css={tw`text-xl`}>{news.url}</h3>
        </a>
        <div css={tw`text-xl my-1`}>
          <span css={tw`mr-1`}>
            取得日時: {new Date(Date.parse(news.createdAt)).toLocaleString()}
          </span>
        </div>
        <div css={tw`text-xl my-1`}>
          <span css={tw`mr-1`}>
            場所（推定）:{' '}
            <LocalNewsTitleView
              country={news.placeCountry}
              pref={news.placePref}
              city={news.placeCity}
              category={news.category}
            />
          </span>
        </div>
        <div css={tw`text-xl my-1`}>
          カテゴリ（推定）:{' '}
          {newsCategories[news.category] && (
            <Link href={categoryPath}>{newsCategories[news.category]}</Link>
          )}
        </div>
        <div>
          <span css={tw`break-all text-xl`}>{news.ogDesc}</span>
          <img css={tw`my-2`} src={news.ogImage} width={350} />
        </div>
      </div>
    </div>
  );
};
