import Link from 'next/link';
import React from 'react';

interface LocalNewsTitleProp {
  country: string | string[];
  pref: string | string[];
  city: string | string[];
  category: string;
}
export const getPlacePath = (
  country,
  pref = null,
  city = null,
  category = null
) => {
  let locationPath = '/place/' + [country, pref, city].join('/');
  if (locationPath[-1] === '/') {
    locationPath = locationPath.slice(0, -1);
  }
  if (category) {
    locationPath += '?category=' + category;
  }
  return locationPath;
};

export const LocalNewsTitleView: React.VFC<LocalNewsTitleProp> = ({
  country,
  pref,
  city,
  category,
}: LocalNewsTitleProp) => {
  return (
    <>
      {country && (
        <>
          <Link href={getPlacePath(country, null, null, category)}>
            {country}
          </Link>
        </>
      )}
      {pref && (
        <>
          &nbsp;/&nbsp;
          <Link href={getPlacePath(country, pref, null, category)}>{pref}</Link>
        </>
      )}
      {city && (
        <>
          &nbsp;/&nbsp;
          <Link href={getPlacePath(country, pref, city, category)}>{city}</Link>
        </>
      )}
    </>
  );
};
