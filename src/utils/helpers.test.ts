import {
  getPointsText,
  truncate,
  arrElemToId,
  extractTextFromHtml,
  englishIdFromNumber,
  twoDigitsNumber,
  formatSeconds,
  deepLinkCheck,
  isSame,
  checkPath
} from './helpers';

describe('getPointsText', () => {
  test('negative number for getPointsText', () => {
    expect(getPointsText(-1.322)).toBe('-2');
  });

  test('positive large number for getPointsText', () => {
    expect(getPointsText(3323123212112321.21312321)).toBe('3,323,123,212,112,321');
  });

  test('null points for getPointsText', () => {
    expect(getPointsText(null)).toBe('0');
  });

  test('undefined points for getPointsText', () => {
    expect(getPointsText(undefined)).toBe('0');
  });
});

describe('truncate', () => {
  test('basic truncate test', () => {
    expect(truncate('pluto', '4')).toBe('plu...');
  });

  test('null for truncate', () => {
    expect(truncate(null, '4')).toBe('');
  });

  test('undefined for truncate', () => {
    expect(truncate(undefined, '4')).toBe('');
  });
});

// need to fix the arrElemToId function so it returns a valid array or object.
// Currently it returns an array with potentially missing/undefined indices.
describe('arrElemToId', () => {
  test.skip('arrElemToId', () => {
    expect(arrElemToId(['4', '3', undefined, null, '1', '2'])).toMatchObject([4, 5, 6, 1, 0]);
  });
});

describe('extractTextFromHtml', () => {
  test('basic conversion for extractTextFromHtml', () => {
    expect(extractTextFromHtml('<div class="foo">hello world</div>')).toBe('hello world');
  });

  test('null for extractTextFromHtml', () => {
    expect(extractTextFromHtml(null)).toBe('');
  });

  test('undefined for extractTextFromHtml', () => {
    expect(extractTextFromHtml(undefined)).toBe('');
  });
});

describe('englishIdFromNumber', () => {
  test('decimal check for englishIdFromNumber', () => {
    expect(englishIdFromNumber(20.32132)).toBe('U');
  });

  test('negative for englishIdFromNumber', () => {
    expect(englishIdFromNumber(-10)).toBe('');
  });

  test('null for englishIdFromNumber', () => {
    expect(englishIdFromNumber(null)).toBe('');
  });

  test('undefined for englishIdFromNumber', () => {
    expect(englishIdFromNumber(undefined)).toBe('');
  });
});

describe('twoDigitsNumber', () => {
  test('negative for twoDigitsNumber', () => {
    expect(twoDigitsNumber(-7)).toBe('-07');
  });

  test('standard for twoDigitsNumber', () => {
    expect(twoDigitsNumber(3)).toBe('03');
  });

  test('null for twoDigitsNumber', () => {
    expect(twoDigitsNumber(null)).toBe('00');
  });

  test('undefined for twoDigitsNumber', () => {
    expect(twoDigitsNumber(undefined)).toBe('00');
  });
});

describe('formatSeconds', () => {
  test('standard for formatSeconds', () => {
    expect(formatSeconds(3)).toBe('00:03');
  });

  test('null for formatSeconds', () => {
    expect(formatSeconds(null)).toBe('00:00');
  });

  test('undefined for formatSeconds', () => {
    expect(formatSeconds(undefined)).toBe('00:00');
  });
});

describe('deepLinkCheck', () => {
  test('undefined for deepLinkCheck', () => {
    expect(deepLinkCheck(undefined)).toBe('');
  });

  test('null for deepLinkCheck', () => {
    expect(deepLinkCheck(null)).toBe('');
  });
  test('negative number for deepLinkCheck', () => {
    expect(deepLinkCheck('/login/-1212')).toBe(false);
  });

  test('standard for deepLinkCheck', () => {
    expect(deepLinkCheck('/login/46')).toBe(true);
  });

  test('null for deepLinkCheck', () => {
    expect(deepLinkCheck('/login/null')).toBe(false);
  });
});

describe('isSame', () => {
  const obj1 = {
    key: 'yes',
    id: true,
    arr: ['string', 56, null]
  };
  const obj2 = {
    id: true,
    key: 'yes',
    arr: ['string', 56, null]
  };
  const arr1 = ['string', 56, null];
  const arr2 = ['string', null, 56];

  test('objects for isSame', () => {
    expect(isSame(obj1, obj2)).toBe(true);
  });

  test('arrays for isSame', () => {
    expect(isSame(arr1, arr2)).toBe(true);
  });

  test('null and undefined for isSame', () => {
    expect(isSame(null, undefined)).toBe(false);
  });
});

describe('checkPath', () => {
  const urls = ['/feed', '/question', '/notes', '/sharelink', '/question', '/post'];
  test('standard for checkPath', () => {
    expect(checkPath('/sharelink', urls)).toBe(true);
  });

  test('undefined for checkPath', () => {
    expect(checkPath(undefined, urls)).toBe(false);
  });

  test('null for checkPath', () => {
    expect(checkPath(null, urls)).toBe(false);
  });
});
