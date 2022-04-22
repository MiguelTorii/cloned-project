import parse from 'html-react-parser';
import moment from 'moment';
import { generatePath } from 'react-router';
import uuidv4 from 'uuid/v4';

import { URL, CHAT_PATH_EXP } from 'constants/navigation';

import type { AttributeUser } from '@twilio/conversations';
import type { ChannelMetadata } from 'features/chat';
import type { DetailedChatUser } from 'reducers/chat';
import type { AppGetState } from 'redux/store';
import type { Channel, ParticipantAttributes, ChatMessages, ChatUser } from 'types/models';

export const getTitle = (
  channel: Channel,
  userId: string,
  members?: (DetailedChatUser | ChatUser)[]
) => {
  try {
    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    const {
      state,
      channelState: { attributes = {} }
    } = channel as any;
    const friendlyName = (channel as any).channelState.friendlyName || '';
    const { users } = attributes;

    if (attributes.friendlyName && attributes.friendlyName !== '') {
      return attributes.friendlyName;
    }

    if (!users || !members) {
      if (friendlyName !== '') {
        return friendlyName;
      } else if (state && state.friendlyName !== '') {
        return state.friendlyName;
      }
      return 'NN';
    }

    const filter = members.filter((o) => {
      if (o.userId) {
        return String(o.userId) !== userId;
      }

      return false;
    });

    if (filter.length > 0) {
      return filter
        .map(
          (user) =>
            `${'firstname' in user ? user.firstname : user.firstName} ${
              'lastname' in user ? user.lastname : user.lastName
            }`
        )
        .join(', ');
    }
  } catch (err) {
    console.error(err);
    return '';
  }
};

export const getGroupTitle = (userId: string, users: ChannelMetadata['users'] | AttributeUser[]) =>
  users
    .filter((user) => String(user.userId) !== String(userId))
    .map((user) => capitalize(user.firstName) + ' ' + capitalize(user.lastName))
    .join(', ');

export const getSubTitle = (message: Record<string, any>, userId: string) => {
  const { state } = message;
  const { attributes, author, body } = state;
  const { firstName, lastName } = attributes;

  if (Number(userId) === Number(author)) {
    return `me: ${body}`;
  }

  return `${firstName} ${lastName}: ${body}`;
};

export interface AvatarData extends ParticipantAttributes {
  identity: string;
}

export const fetchAvatars = async (channel: Channel): Promise<AvatarData[]> => {
  const participants = await channel.getParticipants();
  return participants.map((participant) => {
    const attributes = participant.attributes as ParticipantAttributes;
    return {
      identity: participant.identity || '',
      profileImageUrl: attributes.profileImageUrl
    };
  });
};

const capitalize = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getChannelName = (chatName) => {
  if (chatName) {
    const name = chatName.replace(/-/g, ' ');
    return capitalize(name);
  }
  return '';
};

export const getAvatar = ({
  id,
  profileURLs
}: {
  id: string;
  profileURLs: Array<Record<string, any>>;
}) => {
  const item = profileURLs.find((user) => Number(user.identity) === Number(id));
  return item ? item.profileImageUrl : '';
};

export const processMessages = ({
  items,
  userId,
  channelId
}: {
  items: Array<Record<string, any>>;
  userId: string;
  channelId: string;
}) => {
  try {
    const data: ChatMessages = [];

    for (const item of items) {
      const { state } = item;

      const { attributes, author, body, sid, timestamp } = state;
      const { firstName, lastName, imageKey, isVideoNotification, files, reactions } = attributes;
      const date = moment(timestamp).format('MMMM DD');
      const createdAt = moment(timestamp).format('h:mm a');
      const messageItem = {
        index: item.index,
        sid,
        body,
        files,
        reactions,
        imageKey,
        isVideoNotification,
        firstName,
        lastName,
        createdAt
      };

      if (data.length === 0) {
        data.push({
          type: 'date',
          id: date,
          name: '',
          author: '',
          body: date,
          imageKey: '',
          date: '',
          messageList: []
        });
        data.push({
          type: Number(author) === Number(userId) ? 'own' : 'message',
          id: `${author}-${date}-${messageItem.sid}`,
          name: `${firstName} ${lastName}`,
          author,
          body: '',
          files,
          imageKey: '',
          date,
          messageList: [messageItem]
        });
      } else if (data[data.length - 1].date !== date) {
        data.push({
          type: 'date',
          id: date,
          name: '',
          author: '',
          body: date,
          imageKey: '',
          date: '',
          messageList: []
        });
        data.push({
          type: Number(author) === Number(userId) ? 'own' : 'message',
          id: `${author}-${date}-${messageItem.sid}`,
          name: `${firstName} ${lastName}`,
          author,
          body: '',
          files,
          imageKey: '',
          date,
          messageList: [messageItem]
        });
      } else {
        const previous = data[data.length - 1];

        if (Number(previous.author) === Number(author)) {
          previous.messageList.push(messageItem);
        } else {
          data.push({
            type: Number(author) === Number(userId) ? 'own' : 'message',
            id: `${author}-${date}-${messageItem.sid}`,
            name: `${firstName} ${lastName}`,
            author,
            files,
            body: '',
            imageKey: '',
            date,
            messageList: [messageItem]
          });
        }
      }
    }

    data.push({
      type: 'end',
      /**
       * When the channel changes, the last item is unmounted and will remound with a new key
       * It will trigger the chat scrollbox to be scrolled to the bottom
       *  */
      id: `end-scroll-${channelId}`,
      name: '',
      author: '',
      body: '',
      imageKey: '',
      date: '',
      messageList: []
    });
    return data;
  } catch (err) {
    return [];
  }
};

export type ChatUpload = {
  name: string;
  size: number;
  type: string;
  url: string;
};

export const getFileExtension = (filename) => filename.split('.').pop();

export const getFileAttributes = (files: ChatUpload[]) =>
  files.map((file) => ({
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    file_extension: getFileExtension(file.name),
    file_read_url: file.url
  }));

export const getInitials = (name = ''): string => {
  if (name) {
    const initials = (name.match(/\b(\w)/g) || []).join('');
    if (initials.length < 3) {
      return initials;
    }
    const { length } = initials;
    return initials[0] + initials[length - 1];
  }
  return '';
};

export const containsImage = (message: string) => {
  if (message.includes('<img')) {
    return 'Uploaded a image';
  } else if (message.includes('File Attachment')) {
    return 'Uploaded a file';
  }
  return parse(message);
};

export const bytesToSize = (bytes, decimals = 1) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const kb = 1000;
  const decimal = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const exponent = Math.floor(Math.log(bytes) / Math.log(kb));
  return `${parseFloat((bytes / Math.pow(kb, exponent)).toFixed(decimal))} ${sizes[exponent]}`;
};

// TODO: Test if we get better performance and is a better abstraction as a react-query selector function
export const parseChannelMetadata = (userId: string, metadata?: ChannelMetadata) => {
  const userLength = metadata?.users?.length;
  const isDirectChat = Boolean(userLength && metadata.users.length === 2);
  const isGroupChat = Boolean(userLength && metadata.users.length > 2);

  const otherUsers = metadata?.users.filter((user) => String(user.userId) !== String(userId));
  const lastUser = otherUsers?.[otherUsers.length - 1];
  const name = lastUser ? `${lastUser.firstName} ${lastUser.lastName}` : '';
  const isOnline = Boolean(otherUsers?.some((user) => user.isOnline));

  const thumbnail =
    isDirectChat && lastUser?.profileImageUrl?.match(/\.jpg|\.png|\.jpeg/)
      ? lastUser?.profileImageUrl
      : metadata?.thumbnail;

  return {
    isDirectChat,
    isGroupChat,
    isOnline,
    name,
    otherUsers,
    thumbnail,
    userLength
  };
};

export const removeCurrentUserFromGroupName = (
  groupName,
  user: { firstName: string; lastName: string }
) => {
  const nameExp = new RegExp(`${user.firstName} ${user.lastName},? ?`);
  return groupName.replace(nameExp, '').trim();
};

export const inChatPage = (getState: AppGetState) =>
  getState().router.location.pathname.includes(URL.CHAT);

export const generateChatPath = (communityId?: string | number, channelId?: string) =>
  generatePath(CHAT_PATH_EXP, {
    communityId,
    ...(communityId !== undefined ? { chatId: channelId } : {})
  });
