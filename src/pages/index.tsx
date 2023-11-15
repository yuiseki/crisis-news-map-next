/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const CrisisMap = dynamic(() => import('../components/leaflet/CrisisMap'), {
  ssr: false,
}) as React.FC;

export const Home: React.VFC = () => {
  return <CrisisMap />;
};

export default Home;
