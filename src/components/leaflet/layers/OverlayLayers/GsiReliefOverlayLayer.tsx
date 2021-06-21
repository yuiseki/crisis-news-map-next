import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const GsiReliefOverlayLayer = () => {
  return (
    <AbstractOverlayLayer
      id='gsi-relief-overlay-layer'
      name='国土地理院色別標高図'
      attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>'
      url='https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
      opacity={0.5}
    />
  );
};
