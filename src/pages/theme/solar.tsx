/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const MegaSolarMap = dynamic(
  () => import('../../components/leaflet/maps/theme/MegaSolarMap'),
  {
    ssr: false,
  }
);

export const View: React.VFC = () => {
  return <MegaSolarMap />;
};

export default View;
