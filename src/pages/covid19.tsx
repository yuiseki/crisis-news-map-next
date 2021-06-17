/// <reference types="@emotion/react/types/css-prop" />
import dynamic from 'next/dynamic';
import tw, { css } from 'twin.macro';
import React from 'react';
import { Follow, Share } from 'react-twitter-widgets';

const container = css`
  ${tw`h-screen mx-auto m-0 p-0`}

  iframe#twitter-widget-0 {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 10px !important;
  }

  iframe#twitter-widget-1 {
    z-index: 1000;
    position: absolute !important;
    left: 64px !important;
    bottom: 36px !important;
  }
`;

const Covid19Map = dynamic(() => import('../components/Covid19Map'), {
  ssr: false,
});

export const Covid19MapView: React.VFC = () => {
  return (
    <div className='map' css={container}>
      <Follow username='yuiseki_' />
      <Share url='https://crisis.yuiseki.net/' />
      <Covid19Map />
    </div>
  );
};

export default Covid19MapView;
