import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import AbstractMarkerLayer from './AbstractMarkerLayer';

interface AbstractFireDeptProps {
  id: string;
  title: string;
  category: string;
  icon: string;
}

const AbstractFireDept = ({
  id,
  title,
  category,
  icon,
}: AbstractFireDeptProps) => {
  const { data } = useSWR('/api/firedept');
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (data) {
      const newMarkers = data
        .filter((marker) => {
          return marker.category === category;
        })
        .map((marker) => {
          return {
            center: [marker.lat, marker.long],
            popupContent: marker.detail + ' ' + marker.division,
            id: marker.id,
            icon: icon,
          };
        });
      setMarkers(newMarkers);
    }
  }, [data]);
  return <AbstractMarkerLayer id={id} title={title} markers={markers} />;
};

const FireDeptCrisis = () => {
  return (
    <AbstractFireDept
      id='fire-dept-crisis'
      title='消防災害出動'
      category='crisis'
      icon='/images/caution.png'
    />
  );
};

const FireDeptFire = () => {
  return (
    <AbstractFireDept
      id='fire-dept-fire'
      title='消防火災出動'
      category='fire'
      icon='/images/fire_icon.png'
    />
  );
};

const FireDeptRescue = () => {
  return (
    <AbstractFireDept
      id='fire-dept-rescue'
      title='消防救急出動'
      category='rescue'
      icon='/images/ambulance_fast.png'
    />
  );
};

const FireDeptOther = () => {
  return (
    <AbstractFireDept
      id='fire-dept-other'
      title='消防その他出動'
      category='other'
      icon='/images/caution.png'
    />
  );
};

export const FireDeptLayers = () => {
  return (
    <>
      <FireDeptCrisis />
      <FireDeptFire />
      <FireDeptRescue />
      <FireDeptOther />
    </>
  );
};
