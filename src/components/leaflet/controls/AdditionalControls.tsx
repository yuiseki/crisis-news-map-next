import React from 'react';
import { ExpandControl } from './ExpandControl';
import { GitHubControl } from './GitHubControl';
import { LocateControl } from './LocateControl';

export const AdditionalControls = () => {
  return (
    <>
      <GitHubControl position='bottomleft' />
      <ExpandControl position='topleft' />
      <LocateControl position='topleft' />
    </>
  );
};
