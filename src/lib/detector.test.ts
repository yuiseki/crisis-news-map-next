import { Detector } from '~/lib/detector';

describe('Detector', () => {
  it('constructor', async () => {
    const detector = new Detector('test');
    await detector.ready;
    expect(detector.text).toBe('test');
    expect(detector.location).toStrictEqual({ lat: null, long: null });
  });
  describe('カテゴリーを判定できる', () => {
    describe('crisis: 災害を判定できる', () => {
      it.each([
        ['災害が発生しました'],
        ['地震が発生しました'],
        ['洪水が発生しました'],
      ])('%s', async (text) => {
        const detector1 = new Detector(text);
        await detector1.ready;
        expect(detector1.category).toBe('crisis');
      });
    });
  });
  describe('国家を判定できる', () => {
    it('タイ', async () => {
      const detector1 = new Detector('タイで地震が発生');
      await detector1.ready;
      expect(detector1.country).toBe('タイ');
      expect(detector1.location).toStrictEqual({ lat: 13.73, long: 100.52 });
      const detector2 = new Detector('タイプ');
      await detector2.ready;
      expect(detector2.country).toBe(null);
      const detector3 = new Detector('フルタイム');
      await detector3.ready;
      expect(detector3.country).toBe(null);
    });
  });
});
