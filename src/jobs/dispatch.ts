import fetch from 'node-fetch';
import { dbConnect } from '../lib/dbConnect';
import { Dispatch } from '~/models/Dispatch';
import { Detector } from '~/lib/detector';

const crawl = async () => {
  await dbConnect();
  const res = await fetch('https://www.mk-mode.com/rails/disaster.json');
  const json = await res.json();
  const dispatches = await convertJson(json);
  for await (const dispatch of dispatches) {
    const query = {
      originId: dispatch.originId,
    };
    // eslint-disable-next-line no-console
    console.log(dispatch);
    await Dispatch.findOneAndUpdate(query, dispatch, {
      upsert: true,
    });
  }
  process.exit(0);
};

const convertJson = async (json: any) => {
  const dispatches = [];
  for (const dispatch of json) {
    dispatch.originId = String(dispatch.id);
    if (dispatch.created_at !== null) {
      dispatch.observedAt = new Date(
        Date.parse(dispatch.created_at.replace('.000', ''))
      );
    }
    delete dispatch.id;
    delete dispatch.created_at;
    delete dispatch.tweet_id;
    delete dispatch.pg_name;
    const detector = new Detector(dispatch.division + dispatch.detail);
    await detector.ready;
    dispatch.unit = 'firedept';
    dispatch.category = detector.category;
    dispatch.placeCountry = detector.country;
    dispatch.placePref = detector.pref;
    dispatch.placeCity = detector.city;
    dispatch.latitude = detector.location.lat;
    dispatch.longitude = detector.location.long;
    dispatches.push(dispatch);
  }
  return dispatches;
};

(async () => {
  await crawl();
})();
