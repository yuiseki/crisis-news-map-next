/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import React from 'react';

const MegaSolarMap = dynamic(
  () =>
    import('../../components/leaflet/maps/theme/MegaSolarMap').then(
      (module) => module.MegaSolarMap
    ),
  {
    ssr: false,
  }
) as React.FC;

export const View: React.VFC = () => {
  return <MegaSolarMap />;
};

export default View;
