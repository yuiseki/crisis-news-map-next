/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const PovertyMap = dynamic(
  () => import('../../components/leaflet/maps/theme/PovertyMap'),
  {
    ssr: false,
  }
);

export const PovertyMapView: React.VFC = () => {
  return <PovertyMap />;
};

export default PovertyMapView;
