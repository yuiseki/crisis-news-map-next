/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const Covid19Map = dynamic(() => import('../components/leaflet/Covid19Map'), {
  ssr: false,
});

export const Covid19MapView: React.VFC = () => {
  return <Covid19Map />;
};

export default Covid19MapView;
