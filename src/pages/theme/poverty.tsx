/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const PovertyMap = dynamic(
  () => import('../../components/leaflet/maps/theme/PovertyMap'),
  {
    ssr: false,
  }
) as React.FC;

export const PovertyMapView: React.FC = () => {
  return <PovertyMap />;
};

export default PovertyMapView;
