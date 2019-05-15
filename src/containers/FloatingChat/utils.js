/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// @flow

import moment from 'moment';
import uuidv4 from 'uuid/v4';
import type { ChatMessages } from '../../types/models';

export const getTitle = (channel: Object, userId: string) => {
  const {
    state,
    state: { attributes = {} }
  } = channel;
  const friendlyName = channel.state.attributes.friendlyName || '';
  const { users } = attributes;
  if (attributes.friendlyName && attributes.friendlyName !== '') {
    return attributes.friendlyName;
  }
  if (users) {
    const filter = users.filter(o => {
      if (o.userId) return o.userId.toString() !== userId.toString();
      return false;
    });
    if (filter.length > 0) {
      return filter
        .map(user => `${user.firstName} ${user.lastName}`)
        .join(', ');
    }
  } else if (friendlyName !== '') return friendlyName;
  else if (state && state.friendlyName !== '') return state.friendlyName;
  return 'NN';
};

export const getSubTitle = (message: Object, userId: string) => {
  const { state } = message;
  const { attributes, author, body } = state;
  const { firstName, lastName } = attributes;

  if (Number(userId) === Number(author)) {
    return `me: ${body}`;
  }
  return `${firstName} ${lastName}: ${body}`;
};

export const fetchAvatars = async (channel: Object) => {
  const { members = [] } = channel;
  const result = [];
  for (const member of members) {
    const user = await member[1].getUserDescriptor();
    const { identity = '', attributes = {} } = user;
    const { profileImageUrl = '' } = attributes;
    result.push({ identity, profileImageUrl });
  }
  return result;
};

export const getAvatar = ({
  id,
  profileURLs
}: {
  id: string,
  profileURLs: Array<Object>
}) => {
  const item = profileURLs.find(user => Number(user.identity) === Number(id));
  return item ? item.profileImageUrl : '';
};

export const processMessages = ({
  items,
  userId
}: {
  items: Array<Object>,
  userId: string
}) => {
  const data: ChatMessages = [];
  for (const item of items) {
    const { state } = item;
    const { attributes, author, body, sid, timestamp } = state;
    const { firstName, lastName, imageKey, isVideoNotification } = attributes;
    const date = moment(timestamp).format('MMMM DD');
    const createdAt = moment(timestamp).format('h:mm a');
    if (data.length === 0) {
      data.push({
        type: 'date',
        id: uuidv4(),
        name: '',
        author: '',
        body: date,
        imageKey: '',
        date: '',
        messageList: []
      });
      data.push({
        type: Number(author) === Number(userId) ? 'own' : 'message',
        id: `${author}-${uuidv4()}`,
        name: `${firstName} ${lastName}`,
        author,
        body: '',
        imageKey: '',
        date,
        messageList: [
          {
            sid,
            body,
            imageKey,
            isVideoNotification,
            firstName,
            lastName,
            createdAt
          }
        ]
      });
    } else if (data[data.length - 1].date !== date) {
      data.push({
        type: 'date',
        id: uuidv4(),
        name: '',
        author: '',
        body: date,
        imageKey: '',
        date: '',
        messageList: []
      });
      data.push({
        type: Number(author) === Number(userId) ? 'own' : 'message',
        id: `${author}-${uuidv4()}`,
        name: `${firstName} ${lastName}`,
        author,
        body: '',
        imageKey: '',
        date,
        messageList: [
          {
            sid,
            body,
            imageKey,
            isVideoNotification,
            firstName,
            lastName,
            createdAt
          }
        ]
      });
    } else {
      const previous = data[data.length - 1];
      if (Number(previous.author) === Number(author)) {
        previous.messageList.push({
          sid,
          body,
          imageKey,
          isVideoNotification,
          firstName,
          lastName,
          createdAt
        });
      } else {
        data.push({
          type: Number(author) === Number(userId) ? 'own' : 'message',
          id: `${author}-${uuidv4()}`,
          name: `${firstName} ${lastName}`,
          author,
          body: '',
          imageKey: '',
          date,
          messageList: [
            {
              sid,
              body,
              imageKey,
              isVideoNotification,
              firstName,
              lastName,
              createdAt
            }
          ]
        });
      }
    }
  }

  data.push({
    type: 'end',
    id: `end-scroll-${uuidv4()}`,
    name: '',
    author: '',
    body: '',
    imageKey: '',
    date: '',
    messageList: []
  });
  return data;
};

export const getInitials = ({ name = '' }: { name: string }) => {
  return name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
};
