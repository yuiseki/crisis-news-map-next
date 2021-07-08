import { useEffect, useState } from 'react';
import useSWR from 'swr';

export const useJMARiskTile = (element: string) => {
  const endpoint =
    'https://www.jma.go.jp/bosai/jmatile/data/risk/targetTimes.json';
  const { data } = useSWR(endpoint);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (data) {
      const baseTime = data[0].basetime;
      const validTime = data[0].validtime;
      const newUrl = `https://www.jma.go.jp/bosai/jmatile/data/risk/${baseTime}/none/${validTime}/surf/${element}/{z}/{x}/{y}.png`;
      setUrl(newUrl);
    }
  }, [data]);
  return url;
};

export const useJMANowcastTile = () => {
  const endpoint =
    'https://www.jma.go.jp/bosai/jmatile/data/nowc/targetTimes_N1.json';
  const { data } = useSWR(endpoint);
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (data) {
      const baseTime = data[0].basetime;
      const validTime = data[0].validtime;
      const newUrl = `https://www.jma.go.jp/bosai/jmatile/data/nowc/${baseTime}/none/${validTime}/surf/hrpns/{z}/{x}/{y}.png`;
      setUrl(newUrl);
    }
  }, [data]);
  return url;
};
