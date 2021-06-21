import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import locationList from '../data/geonlp.ex.nii.ac.jp/geonlp_japan.json';
import categoryList from '../data/yuiseki.net/detector_category_words.json';

const globalAny: any = global;
let cached = globalAny.locationData;

if (!cached) {
  cached = globalAny.locationData = { conn: null, promise: null };
}

/**
 * 文字列を与えるとカテゴリや位置情報を検出するクラス
 */
export class Detector {
  ready: Promise<any>;
  text: string;
  category = 'unknown';
  country: string = null;
  pref: string = null;
  city: string = null;
  river: string = null;
  mountain: string = null;
  station: string = null;
  airport: string = null;
  police: string = null;
  location: any;
  geohash: string;

  static locationList = null;

  static categoryList = categoryList;

  /**
   * locationListのcsvファイルを読み込んでObjectにする非同期メソッド
   */
  public static loadLocationList = async () => {
    return new Promise((resolve) => {
      // locationKey = country, pref, city, ...
      for (const locationKey of Object.keys(locationList)) {
        const location = locationList[locationKey];
        // ファイルを読み込む
        const fileData: Buffer = fs.readFileSync(
          './src/data/geonlp.ex.nii.ac.jp/' + location.index.filename
        );
        // CSVとして解析する
        const rows = csvParseSync(fileData);
        for (const row of rows) {
          // 行からname部分を取り出す
          let name: string = row[location.index.name_idx];
          if (
            // nameが1文字のやつはマッチしすぎるので除外する
            name.length !== 1 &&
            // nameに(が含まれるやつは正規表現が壊れるので除外する
            name.indexOf('(') === -1
          ) {
            // 駅の辞書にはなぜか"～駅"が欠けていることがある
            if (locationKey === 'station' && !name.endsWith('駅')) {
              name = name + '駅';
            }
            // 警察の辞書には交番や派出所まで含まれているが警察署だけで充分
            if (locationKey === 'police' && !name.endsWith('警察署')) {
              continue;
            }
            locationList[locationKey].data[name] = {};
            // 市区町村に関しては上位の都道府県をデータとして持つ
            if (locationKey === 'city') {
              locationList[locationKey].data[name].hyperpref = row[
                location.index.hyperpref
              ].split('/')[0];
            }
            if (
              // latが空ではない
              row[location.index.lat_idx] !== '' &&
              // longが空ではない
              row[location.index.long_idx] !== ''
            ) {
              locationList[locationKey].data[name].lat = parseFloat(
                row[location.index.lat_idx]
              );
              locationList[locationKey].data[name].long = parseFloat(
                row[location.index.long_idx]
              );
            }
          }
        }
      }
      resolve(locationList);
    });
  };

  /**
   * 何らかの文章と検出したいキーワードのリストを渡すと、
   *   - より出現頻度の高いキーワード
   *   - 同じ出現頻度の場合、より長いキーワード
   * でソートしてトップのキーワードを返すメソッド
   * @param {string} text 何らかの文章
   * @param {string[]} areaNames 検出したいキーワードのリスト
   * @return {string} トップのキーワード
   */
  public static detect(text: string, areaNames: string[]): string {
    const areaCounter = {};
    for (const areaName of areaNames) {
      const regExp = new RegExp(areaName, 'g');
      const count = (text.match(regExp) || []).length;
      if (count > 0) {
        areaCounter[areaName] = count;
      }
    }
    const areaNamesSorted = Object.keys(areaCounter).sort((a, b) => {
      if (areaCounter[a] === areaCounter[b]) {
        return a.length < b.length ? 1 : -1;
      } else {
        return areaCounter[a] < areaCounter[b] ? 1 : -1;
      }
    });
    if (areaNamesSorted[0] === undefined) {
      return null;
    } else {
      return areaNamesSorted[0];
    }
  }

  /**
   * コンストラクタ
   * @param {string} text 分析したい文章
   */
  constructor(text: string) {
    this.text = text;
    this.location = null;
    this.location = {
      lat: null,
      long: null,
    };
    this.geohash = null;
    // eslint-disable-next-line no-async-promise-executor
    this.ready = new Promise(async (resolve) => {
      // クラスメソッド Detector.locationList が存在しない最初の時だけ
      // loadLocationListを呼ぶ
      if (Detector.locationList === null) {
        Detector.locationList = await Detector.loadLocationList();
      }
      if (this.text.length > 0) {
        this.detecting();
      }
      resolve(null);
    });
  }

  /**
   * setter for location
   * @param {any} location lat, longプロパティを持つオブジェクト
   */
  private setLocation(location) {
    if (location === undefined || location === null) {
      this.location = {
        lat: null,
        long: null,
      };
    } else {
      this.location = location;
      if (this.location.lat === undefined || this.location.long === undefined) {
        this.location.lat = null;
        this.location.long = null;
      }
    }
  }

  /**
   * すべての検出メソッドを順番に実行する
   */
  public detecting() {
    this.detectCategory();
    this.detectCountry();
    this.detectPref();
    this.detectCity();
    this.detectRiver();
    this.detectMountain();
    this.detectStation();
    this.detectAirport();
    this.detectPolice();
  }

  /**
   * 文章のカテゴリーを検出する
   */
  public detectCategory() {
    // category = crisis, drug, sports, ...
    for (const category of Object.keys(Detector.categoryList)) {
      for (const keyword of Detector.categoryList[category]) {
        const regexp = new RegExp(keyword, 'g');
        if (this.text.match(regexp)) {
          this.category = category;
        }
      }
    }
    if (this.category === undefined || this.category === null) {
      this.category = 'unknown';
    }
  }

  /**
   * 国を検出する
   */
  public detectCountry() {
    const re1 = new RegExp('タイ[ァ-ンヴー]+', 'g');
    const re2 = new RegExp('[ァ-ンヴー]+タイ', 'g');

    this.country = Detector.detect(
      this.text.replaceAll(re1, '').replaceAll(re2, ''),
      Object.keys(locationList.country.data)
    );
    if (this.country !== null) {
      this.setLocation(locationList.country.data[this.country]);
    }
  }

  /**
   * 都道府県を検出する
   */
  public detectPref() {
    this.pref = Detector.detect(this.text, Object.keys(locationList.pref.data));
    if (this.pref !== null) {
      // 都道府県が検出できているなら国は日本とする
      this.country = '日本';
      this.setLocation(locationList.pref.data[this.pref]);
    }
  }

  /**
   * 市区町村を検出する
   */
  public detectCity() {
    this.city = Detector.detect(this.text, Object.keys(locationList.city.data));
    if (this.city !== null) {
      // 市区町村が検出できているなら国は日本とする
      this.country = '日本';
      // 市区町村が検出できているなら都道府県も特定できる
      if (this.pref === undefined || this.pref === null) {
        this.pref = locationList.city.data[this.city].hyperpref;
      }
      // 市区町村のデータはlat, longが空のことがある
      // 空だったら都道府県の座標にしておく
      if (
        locationList.city.data[this.city].lat === undefined ||
        locationList.city.data[this.city].long === undefined
      ) {
        this.setLocation(locationList.pref.data[this.pref]);
      } else {
        this.setLocation(locationList.city.data[this.city]);
      }
    }
  }

  /**
   * 河川を検出する
   */
  public detectRiver() {
    this.river = Detector.detect(
      this.text,
      Object.keys(locationList.river.data)
    );
  }

  /**
   * 山を検出する
   */
  public detectMountain() {
    this.mountain = Detector.detect(
      this.text,
      Object.keys(locationList.mountain.data)
    );
  }

  /**
   * 駅を検出する
   */
  public detectStation() {
    this.station = Detector.detect(
      this.text,
      Object.keys(locationList.station.data)
    );
    if (this.station !== null) {
      this.country = '日本';
      this.setLocation(locationList.station.data[this.station]);
    }
  }

  /**
   * 空港を検出する
   */
  public detectAirport() {
    this.airport = Detector.detect(
      this.text,
      Object.keys(locationList.airport.data)
    );
    if (this.airport !== null) {
      this.country = '日本';
      this.setLocation(locationList.airport.data[this.airport]);
    }
  }

  /**
   * 警察署を検出する
   */
  public detectPolice() {
    this.police = Detector.detect(
      this.text,
      Object.keys(locationList.police.data)
    );
    if (this.police !== null) {
      this.country = '日本';
      this.setLocation(locationList.police.data[this.police]);
    }
  }
}
