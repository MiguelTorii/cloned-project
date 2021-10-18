import { getInitials, getChannelName } from './chat';

describe('getInitials', () => {
  test('middle name test for getInitials', () => {
    expect(getInitials('Jaron Coco Swanson')).toBe('JS');
  });

  test('all caps name test for getInitials', () => {
    expect(getInitials('JARON JOHNSON')).toBe('JJ');
  });

  test('lowercase name test for getInitials', () => {
    expect(getInitials('jaron coco johnson')).toBe('jj');
  });

  test('undefined name for getIntials', () => {
    expect(getInitials(undefined)).toBe('');
  });

  test('null name for getInitials', () => {
    expect(getInitials(null)).toBe('');
  });
});

describe('getChannelName', () => {
  test('single word channel name for getChannelName', () => {
    expect(getChannelName('CHANNEL')).toBe('CHANNEL');
  });

  test('null channel name for getChannelName', () => {
    expect(getChannelName(null)).toBe('');
  });

  test('undefined channel name for getChannelName', () => {
    expect(getChannelName(undefined)).toBe('');
  });
});
