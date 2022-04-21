import type { Channel } from 'types/models';

export type Unreads = {
  [x: string]: number;
};

export const getUnreadCountFromChannel = async (channel: Channel): Promise<Unreads> => {
  const count = await channel.getMessagesCount();

  let unreadCount: number;

  if (channel.lastReadMessageIndex === null) {
    unreadCount = count;
  } else if (channel.lastReadMessageIndex + 1 > count) {
    unreadCount = 0; // check the channel is new or check lastConsumedMessageIndex is bigger than message count
  } else {
    unreadCount = count - (channel.lastReadMessageIndex + 1);
  }

  return {
    [channel.sid]: unreadCount
  };
};

export const getChannelsUnreadCount = async (channels: Channel[] | undefined) => {
  // Type safety
  // https://tkdodo.eu/blog/react-query-and-type-script#type-safety-with-the-enabled-option
  if (!channels) {
    return Promise.reject(new Error('No channels data.'));
  }

  const promises = channels.map((channel) => getUnreadCountFromChannel(channel));
  const unreadMessagesArr = await Promise.all(promises);
  const unreadMessages: Unreads = {};

  for (const message of unreadMessagesArr) {
    const channelId = Object.keys(message)[0];
    unreadMessages[channelId] = message[channelId];
  }

  return unreadMessages;
};

export const getChannelUnreadCount = async (channel: Channel | undefined) => {
  if (!channel) {
    return Promise.reject(new Error('No channel data.'));
  }

  const unreadMessages = await getUnreadCountFromChannel(channel);
  return unreadMessages[channel.sid];
};
