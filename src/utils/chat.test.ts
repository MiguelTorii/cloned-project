import { getInitials, getChannelName } from './chat';

test('name is not null', () => {
  expect(getInitials('Jaron Coco Johnson')).toBe('JJ');
});

test('channel name is valid', () => {
  expect(getChannelName('Name-of-this-CHANNEL')).toBe('Name of this CHANNEL');
});
