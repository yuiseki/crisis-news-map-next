import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import MarkerLayer from './MarkerLayer';

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
            text: marker.detail + ' ' + marker.division,
            id: marker.id,
            icon: icon,
          };
        });
      setMarkers(newMarkers);
    }
  }, [data]);
  return <MarkerLayer id={id} title={title} markers={markers} />;
};

export const FireDeptCrisis = () => {
  return (
    <AbstractFireDept
      id='fire-dept-crisis'
      title='消防災害出動'
      category='crisis'
      icon='/images/caution.png'
    />
  );
};

export const FireDeptFire = () => {
  return (
    <AbstractFireDept
      id='fire-dept-fire'
      title='消防火災出動'
      category='fire'
      icon='/images/fire_icon.png'
    />
  );
};

export const FireDeptRescue = () => {
  return (
    <AbstractFireDept
      id='fire-dept-rescue'
      title='消防救急出動'
      category='rescue'
      icon='/images/ambulance_fast.png'
    />
  );
};

export const FireDeptOther = () => {
  return (
    <AbstractFireDept
      id='fire-dept-other'
      title='消防その他出動'
      category='other'
      icon='/images/caution.png'
    />
  );
};
