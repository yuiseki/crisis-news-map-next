import fetch from 'node-fetch';
import { dbConnect } from '../lib/dbConnect';
import { RiverLevel } from '~/models/RiverLevel';
import prefList from '../data/k.river.go.jp/pref.json';
import cityList from '../data/k.river.go.jp/twn.json';

const crawl = async () => {
  await dbConnect();
  for (const pref of prefList.prefs) {
    // eslint-disable-next-line no-console
    console.log(pref.name + ': ' + pref.code);
    if (pref.code === null) {
      continue;
    }

    const url =
      'https://k.river.go.jp/swin/files/area_info/current/' +
      pref.code +
      '.json';
    const res = await fetch(url);
    const json = await res.json();
    const riverLevels = await convertJson(json);
    for await (const riverLevel of riverLevels) {
      const query = {
        code: riverLevel.code,
        observedAt: riverLevel.observedAt,
      };
      await RiverLevel.findOneAndUpdate(query, riverLevel, {
        upsert: true,
      });
    }
  }
  process.exit(0);
};

const convertJson = async (json: any) => {
  const riverLevels = [];
  for (const riverLevel of json.obss) {
    riverLevel.observedAt = new Date(Date.parse(riverLevel.obsTime));
    riverLevel.placeCountry = '日本';
    riverLevel.placeRiver = riverLevel.name;
    for (const pref of prefList.prefs) {
      if (riverLevel.prefCode === pref.code) {
        riverLevel.placePref = pref.name;
      }
    }
    for (const city of cityList.towns) {
      if (riverLevel.twnCode === city.code) {
        riverLevel.placeCity = city.name;
      }
    }
    if (riverLevel.level >= riverLevel.fladLevel) {
      riverLevel.isFlood = true;
    } else {
      riverLevel.isFlood = false;
    }
    riverLevel.latitude = riverLevel.lat;
    delete riverLevel.lat;
    riverLevel.longitude = riverLevel.lon;
    delete riverLevel.lon;
    riverLevels.push(riverLevel);
  }
  return riverLevels;
};

(async () => {
  await crawl();
})();
