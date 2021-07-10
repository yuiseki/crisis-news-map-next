/// <reference types="@emotion/react/types/css-prop" />
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

export const CrisisMapView: React.VFC = () => {
  const router = useRouter();
  const { theme } = router.query;
  const content = `0;URL=/theme/${theme}`;
  return (
    <Head>
      <meta httpEquiv='refresh' content={content} />
    </Head>
  );
};

export default CrisisMapView;
