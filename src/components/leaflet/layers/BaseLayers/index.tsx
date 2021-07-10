import React from 'react';
import { GSIBaseLayer } from './GSIBaseLayer';
import { GSIPhotoLayer } from './GSIPhotoLayer';
import { OSMBaseLayer } from './OSMBaseLayer';

export const BaseLayers = () => {
  return (
    <>
      <GSIBaseLayer />
      <GSIPhotoLayer />
      <OSMBaseLayer />
    </>
  );
};
