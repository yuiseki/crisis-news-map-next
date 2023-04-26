/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const Covid19Map = dynamic(
  () => import('../../components/leaflet/maps/theme/Covid19Map'),
  {
    ssr: false,
  }
) as React.FC;

export const Covid19MapView: React.VFC = () => {
  return <Covid19Map />;
};

export default Covid19MapView;
