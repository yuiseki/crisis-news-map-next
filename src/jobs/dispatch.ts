import fetch from 'node-fetch';
import { dbConnect } from '../lib/dbConnect';
import { IDispatchModel, Dispatch } from '~/models/Dispatch';
import { detectCategories } from 'detect-categories-ja';
import { detectLocation } from 'detect-location-jp';

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
  const dispatches: IDispatchModel[] = [];
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
    dispatch.unit = 'firedept';
    const text = dispatch.division + dispatch.detail;
    const categories = await detectCategories(text);
    dispatch.category = categories[0]?.id;
    const location = await detectLocation(text);
    if (location === null) {
      dispatches.push(dispatch);
      continue;
    }
    dispatch.placeCountry = location.country;
    dispatch.placePref = location.state;
    dispatch.placeCity = location.city;
    dispatch.latitude = location.latitude;
    dispatch.longitude = location.longitude;
    dispatches.push(dispatch);
  }
  return dispatches;
};

(async () => {
  await crawl();
})();
