/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const ChildMap = dynamic(
  () => import('../components/leaflet/maps/theme/ChildMap'),
  {
    ssr: false,
  }
);

export const ChildMapView: React.VFC = () => {
  return <ChildMap />;
};

export default ChildMapView;
