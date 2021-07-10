import Link from 'next/link';
import React from 'react';
import tw from 'twin.macro';

interface LinkProps {
  path: string;
  title: string;
}

export const LinkControl = ({
  title,
  links,
}: {
  title: string;
  links: LinkProps[];
}) => {
  return (
    <div
      id='nav-link'
      className='leaflet-bar leaflet-control leaflet-control-custom'
    >
      <span css={tw`text-xl`}>
        <i className='fas fa-info-circle' />
        {title}
      </span>
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
