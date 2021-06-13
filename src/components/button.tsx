import { useCallback } from 'react';
import tw, { css } from 'twin.macro';

const styles = css`
  ${tw`mt-8 bg-blue-500 text-white rounded px-2 py-1`}
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
`;

export const Button: React.VFC = () => {
  const showAlert = useCallback(() => {
    window.alert('button clicked');
  }, []);
  return (
    <button css={styles} onClick={showAlert}>
      button
    </button>
  );
};
