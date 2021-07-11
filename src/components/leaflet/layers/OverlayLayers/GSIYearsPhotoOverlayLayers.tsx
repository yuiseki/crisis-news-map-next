import React from 'react';
import AbstractOverlayLayer from './AbstractOverlayLayer';

export const GSIYearsPhotoOverlayLayers = () => {
  const years = [...Array(15).keys()].map((i) => 2007 + i);
  return (
    <>
      {years.map((year) => {
        return (
          <AbstractOverlayLayer
            id={'gsi-photo-layer-' + year}
            key={'gsi-photo-layer-' + year}
            name={`国土地理院 衛星写真 ${year}年`}
            attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html#nendophoto">国土地理院</a>'
            url='https://maps.gsi.go.jp/xyz/nendophoto2008/{z}/{x}/{y}.png'
            opacity={0.7}
          />
        );
      })}
    </>
  );
};
