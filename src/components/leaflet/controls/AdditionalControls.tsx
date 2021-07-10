import React from 'react';
import { ExpandControl } from './ExpandControl';
import { LocateControl } from './LocateControl';
import { GitHubControl } from './GitHubControl';
import { Follow, Share } from 'react-twitter-widgets';

export const AdditionalControls = () => {
  return (
    <>
      <ExpandControl position='topleft' />
      <LocateControl position='topleft' />
      <GitHubControl position='bottomleft' />
      <Follow username='yuiseki_' />
      <Share url={window.location.href} />
    </>
  );
};
