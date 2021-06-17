/// <reference types="@emotion/react/types/css-prop" />
import React from 'react';
import 'twin.macro';

export const Home: React.VFC = () => {
  return (
    <div tw='m-4'>
      <ul tw='m-4 list-disc'>
        <li>
          <a href='/crisis'>災害情報</a>
        </li>
        <li>
          <a href='/covid19'>新型コロナウイルス情報</a>
        </li>
      </ul>
    </div>
  );
};

export default Home;
