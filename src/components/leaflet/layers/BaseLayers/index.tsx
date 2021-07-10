import React from 'react';
import { GSIBaseLayer } from './GSIBaseLayer';
import { GSIPhotoLayer } from './GSIPhotoLayer';
import { JMABaseLayer } from './JMABaseLayer';
import { OSMBaseLayer } from './OSMBaseLayer';

export const BaseLayers = () => {
  return (
    <>
      <JMABaseLayer />
      <GSIBaseLayer />
      <GSIPhotoLayer />
      <OSMBaseLayer />
    </>
  );
};
