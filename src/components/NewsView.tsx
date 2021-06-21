import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import { INews } from '~/models/News';

export const NewsView: React.VFC<{ news: INews }> = ({
  news,
}: {
  news: INews;
}) => {
  let locationPath = '/place/';
  if (news.placeCountry) {
    locationPath += news.placeCountry;
  }
  if (news.placePref) {
    locationPath += '/' + news.placePref;
  }
  if (news.placeCity) {
    locationPath += '/' + news.placeCity;
  }

  const categoryPath = `/news/${news.category}`;

  return (
    <div css={tw`m-5`}>
      <a href={news.url}>
        <h2 css={tw`text-2xl font-bold`}>{news.ogTitle}</h2>
        <h3 css={tw`text-2xl`}>{news.url}</h3>
      </a>
      <div css={tw`text-xl my-1`}>
        <span css={tw`mr-1`}>
          取得日時: {new Date(Date.parse(news.createdAt)).toLocaleString()}
        </span>
      </div>
      <div css={tw`text-xl my-1`}>
        <span css={tw`mr-1`}>
          場所（推定）: <Link href={locationPath}>{locationPath}</Link>
        </span>
      </div>
      <div css={tw`text-xl my-1`}>
        カテゴリ（推定）: <Link href={categoryPath}>{news.category}</Link>
      </div>
      <div>{news.ogDesc}</div>
    </div>
  );
};
