import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import { INews } from '~/models/News';

export const NewsView: React.VFC<{ news: INews }> = ({
  news,
}: {
  news: INews;
}) => {
  let locationPath = '/';
  if (news.placeCountry) {
    locationPath += news.placeCountry;
  }
  if (news.placePref) {
    locationPath += '/' + news.placePref;
  }
  if (news.placeCity) {
    locationPath += '/' + news.placeCity;
  }

  return (
    <div css={tw`m-5`}>
      <a href={news.url}>
        <h2 css={tw`text-2xl font-bold`}>{news.ogTitle}</h2>
        <h3 css={tw`text-2xl`}>{news.url}</h3>
      </a>
      <div css={tw`text-xl my-1`}>
        <span css={tw`mr-1`}>
          {new Date(Date.parse(news.createdAt)).toLocaleString()}
        </span>
        <span css={tw`mr-1`}>
          <Link href={locationPath}>{locationPath}</Link>
        </span>
        <span>{news.category}</span>
      </div>
      <div>{news.ogDesc}</div>
    </div>
  );
};
