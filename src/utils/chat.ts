/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// @flow

import moment from 'moment';
import uuidv4 from 'uuid/v4';
import parse from 'html-react-parser';
import type { ChatMessages } from '../../types/models';

export const getTitle = (channel: Object, userId: string, members: array) => {
  try {
    const {
      state,
      channelState: { attributes = {} }
    } = channel;
    const friendlyName = channel.channelState.friendlyName || '';
    const { users } = attributes;
    if (attributes.friendlyName && attributes.friendlyName !== '') {
      return attributes.friendlyName;
    }
    if (users) {
      const filter = members.filter((o) => {
        if (o.userId) {
          return o.userId.toString() !== userId.toString();
        }
        return false;
      });
      if (filter.length > 0) {
        return filter.map((user) => `${user.firstname} ${user.lastname}`).join(', ');
      }
    } else if (friendlyName !== '') {
      return friendlyName;
    } else if (state && state.friendlyName !== '') {
      return state.friendlyName;
    }
    return 'NN';
  } catch (err) {
    console.log(err);
    return '';
  }
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
  try {
    const { members = [] } = channel;
    const result = [];
    for (const member of members) {
      const user = await member[1].getUserDescriptor();
      const { identity = '', attributes = {} } = user;
      const { profileImageUrl = '' } = attributes;
      result.push({ identity, profileImageUrl });
    }
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const capitalize = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getChannelName = (chatName) => {
  const name = chatName.replaceAll('-', ' ');

  return capitalize(name);
};

export const getAvatar = ({ id, profileURLs }: { id: string, profileURLs: Array<Object> }) => {
  const item = profileURLs.find((user) => Number(user.identity) === Number(id));
  return item ? item.profileImageUrl : '';
};

export const processMessages = ({ items, userId }: { items: Array<Object>, userId: string }) => {
  try {
    const data: ChatMessages = [];
    for (const item of items) {
      const { state } = item;
      const { attributes, author, body, sid, timestamp } = state;
      const { firstName, lastName, imageKey, isVideoNotification, files } = attributes;
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
          files,
          imageKey: '',
          date,
          messageList: [
            {
              sid,
              body,
              files,
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
          files,
          imageKey: '',
          date,
          messageList: [
            {
              sid,
              body,
              imageKey,
              isVideoNotification,
              files,
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
            files,
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
            files,
            body: '',
            imageKey: '',
            date,
            messageList: [
              {
                sid,
                body,
                imageKey,
                files,
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
  } catch (err) {
    return [];
  }
};

export const getFileExtension = (filename) => filename.split('.').pop();

export const getFileAttributes = (files) =>
  files.map((file) => ({
    file_name: file.name,
    file_size: file.size,
    file_type: file.type,
    file_extension: getFileExtension(file.name),
    file_read_url: file.url
  }));

export const getInitials = (name: string = '') => {
  const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
  if (initials.length < 3) {
    return initials;
  }
  const { length } = initials;
  return initials[0] + initials[length - 1];
};

export const containsImage = (message: string) =>
  message.includes('<img')
    ? 'Uploaded a image'
    : message.includes('File Attachment')
    ? 'Uploaded a file'
    : parse(message);

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
