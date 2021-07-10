import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';

interface LinkProps {
  path: string;
  title: string;
}

export const LinkControl = ({ links }: { links: LinkProps[] }) => {
  return (
    <div
      id='nav-link'
      className='leaflet-bar leaflet-control leaflet-control-custom'
    >
      <i className='fas fa-info-circle' />
      他の地図
      <ul css={tw`pl-6 list-disc`}>
        {links.map((link) => {
          return (
            <li key={link.path}>
              <Link href={link.path}>{link.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
