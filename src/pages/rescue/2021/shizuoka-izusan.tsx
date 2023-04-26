/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const IzusanMap = dynamic(
  () => import('../../../components/leaflet/maps/rescue/2021/IzusanMap'),
  {
    ssr: false,
  }
) as React.FC;

export const PovertyMapView: React.VFC = () => {
  return <IzusanMap />;
};

export default PovertyMapView;
