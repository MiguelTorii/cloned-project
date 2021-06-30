/* eslint-disable import/prefer-default-export */
// @flow

import uuidv4 from 'uuid/v4';
import {
  getGroupMembers,
  getShareLink,
  getChannels,
  muteChannel,
  unmuteChannel,
  renewTwilioToken,
  leaveChat,
  blockChatUser,
  sendMessage,
  createChannel
} from 'api/chat';
import Chat from 'twilio-chat';
import update from 'immutability-helper';
import { push } from 'connected-react-router';
import axios from "axios";
import moment from 'moment'
import { chatActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import { getPresignedURL } from '../api/media';
import { apiUpdateChat } from '../api/chat';


const getAvailableSlots = width => {
  try {
    const chatSize = 320;
    return Math.trunc((width - chatSize) / chatSize);
  } catch (err) {
    return 0;
  }
};

const requestOpenCreateChatGroupChannel = ({
  uuid
}: {
  uuid: string
}): Action => ({
  type: chatActions.OPEN_CREATE_CHAT_GROUP_CHANNEL_REQUEST,
  payload: {
    uuid
  }
});

const requestStartChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityVideo,
  entityUuid
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityVideo: boolean,
  entityUuid: string
}): Action => ({
  type: chatActions.START_CHANNEL_WITH_ENTITY_REQUEST,
  payload: {
    entityId,
    entityFirstName,
    entityLastName,
    entityVideo,
    entityUuid
  }
});

const newMessage = ({ message }): Action => ({
  type: chatActions.NEW_CHAT_MESSAGE,
  payload: { message }
})

const startLoading = (): Action => ({
  type: chatActions.CHAT_START_LOADING,
})

const initLocal = ({ local }: { local: Object }): Action => ({
  type: chatActions.INIT_LOCAL_CHAT,
  payload: { local }
})

const initClient = ({ client }: { client: Object }): Action => ({
  type: chatActions.INIT_CLIENT_CHAT,
  payload: { client }
})

const initChannels = ({ channels, local }: { channels: array, local: Object }): Action => ({
  type: chatActions.INIT_CHANNELS_CHAT,
  payload: { channels, local }
})

const updateChannel = ({ channel, unread }: { channel: Object, unread: number }): Action => ({
  type: chatActions.UPDATE_CHANNEL_CHAT,
  payload: { channel, unread }
})

const updateShareLink = ({ shareLink, channelId }: { channelId: number, shareLink: string }): Action => ({
  type: chatActions.UPDATE_SHARE_LINK_CHAT,
  payload: { shareLink, channelId }
})

const updateMembers = ({ members, channelId }: { channelId: number, members: Object }): Action => ({
  type: chatActions.UPDATE_MEMBERS_CHAT,
  payload: { members, channelId }
})

const removeMember = ({ member }: { member: Object }): Action => ({
  type: chatActions.REMOVE_MEMBER_CHAT,
  payload: { member }
})

const addChannel = ({ members, userId, channel, unread }: { channel: Object, unread: number, userId: string, members: array }): Action => ({
  type: chatActions.ADD_CHANNEL_CHAT,
  payload: { userId, channel, unread, members }
})

const removeChannel = ({ sid }: { sid: string }): Action => ({
  type: chatActions.REMOVE_CHANNEL_CHAT,
  payload: { sid }
})

const closeNewChannelAction = () => ({
  type: chatActions.CLOSE_NEW_CHANNEL
})

const shutdown = (): Action => ({
  type: chatActions.SHUTDOWN_CHAT,
})

const setOpenChannels = ({ openChannels }: { openChannels: array }) => ({
  type: chatActions.SET_OPEN_CHANNELS,
  payload: { openChannels }
})

const muteChannelLocal = ({ sid }: { sid: string }) => ({
  type: chatActions.MUTE_CHANNEL,
  payload: { sid }
})

const setCurrentChannelAction = ({ currentChannel }: { currentChannel: Object }) => ({
  type: chatActions.SET_CURRENT_CHANNEL,
  payload: { currentChannel }
})

const setCurrentCommunityChannelAction = ({ currentChannel }: { currentChannel: Object }) => ({
  type: chatActions.SET_CURRENT_COMMUNITY_CHANNEL,
  payload: { currentChannel }
})

const createNewChannel = ({ newChannel, openChannels }: { newChannel: boolean, openChannels: array }) => ({
  type: chatActions.CREATE_NEW_CHANNEL,
  payload: { newChannel, openChannels }
})

const setMainMessageAction = ({ mainMessage }: { mainMessage: string }) => ({
  type: chatActions.SET_MAIN_MESSAGE,
  payload: { mainMessage }
})

const updateFriendlyName = ({ channel }: { channel: Object }) => ({
  type: chatActions.UPDATE_FRIENDLY_NAME,
  payload: { channel }
})

export const setMainMessage = (mainMessage) => (dispatch: Dispatch) => {
  dispatch(setMainMessageAction({ mainMessage }))
}

export const updateChannelAttributes = (channelSid: string, attributes: Object) => ({
  type: chatActions.UPDATE_CHANNEL_ATTRIBUTES,
  payload: {
    sid: channelSid,
    attributes
  }
});


const fetchMembers = async sid => {
  const res = await getGroupMembers({ chatId: sid })
  const members = res.map(m => ({
    registered: m.registered,
    firstname: m.firstName,
    lastname: m.lastName,
    image: m.profileImageUrl,
    roleId: m.roleId,
    role: m.role,
    userId: m.userId,
    isOnline: m.isOnline
  }))
  return members
}

export const setCurrentChannel = (currentChannel) => async (dispatch: Dispatch) => {
  if (currentChannel) {
    const members = await fetchMembers(currentChannel.sid)
    const shareLink = await getShareLink(currentChannel.sid)
    localStorage.setItem('currentDMChannel', currentChannel.sid)
    dispatch(updateMembers({ members, channelId: currentChannel.sid }))
    dispatch(updateShareLink({ shareLink, channelId: currentChannel.sid }))
  }
  dispatch(setCurrentChannelAction({ currentChannel }))
}

export const setCurrentCommunityChannel = currentChannel => async (dispatch: Dispatch) => {
  if (currentChannel) {
    const members = await fetchMembers(currentChannel.sid)
    const shareLink = await getShareLink(currentChannel.sid)
    dispatch(updateMembers({ members, channelId: currentChannel.sid }))
    dispatch(updateShareLink({ shareLink, channelId: currentChannel.sid }))
  }

  dispatch(setCurrentCommunityChannelAction({ currentChannel }))
}

export const closeNewChannel = () => (dispatch: Dispatch) => {
  dispatch(closeNewChannelAction())
}

export const handleNewChannel = newChannel => (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { openChannels } } } = getState()
  const availableSlots = getAvailableSlots(window.innerWidth);
  const newState = update(openChannels, {
    $apply: b => {
      const newB = update(b, { $splice: [[availableSlots - 1]] });
      return [...newB];
    }
  });
  dispatch(createNewChannel({ newChannel, openChannels: newState }))
}

export const openCreateChatGroup = () => async (dispatch: Dispatch) => {
  dispatch(requestOpenCreateChatGroupChannel({ uuid: uuidv4() }));
};

const initLocalChannels = async (dispatch, currentLocal = {}) => {
  try {
    dispatch(startLoading())
    const local = await getChannels()

    if (
      Object.keys(local).length > 0 &&
      Object.keys(currentLocal).length > 0 &&
      !localStorage.getItem('currentDMChannel')
    ) {
      let channelList = [];
      channelList = Object.keys(local).filter(l => !local[l].lastMessage.message)
      const recentMessageChannels = Object.keys(local).filter(l => local[l].lastMessage.message)
      if (recentMessageChannels.length) {
        channelList = recentMessageChannels.sort((a, b) => {
          return moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
        })
      }

      dispatch(setCurrentChannel(currentLocal[channelList[0]].twilioChannel))
    }
    dispatch(initLocal({ local }))
  } catch (e) {
    console.log(e)
  }
}

export const openChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityVideo,
  fullscreen = false,
  notRegistered = false,
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityVideo: boolean,
  fullscreen: boolean,
  notRegistered: boolean
}) => async (dispatch: Dispatch, getState: Function) => {
  if (!fullscreen) {
    dispatch(
      requestStartChannelWithEntity({
        entityId,
        entityFirstName,
        entityLastName,
        entityVideo,
        entityUuid: uuidv4()
      })
    );
  } else {
    const { chatId, isNewChat } = await createChannel({
      users: [entityId],
    });

    if (isNewChat) await initLocalChannels(dispatch)
    const {
      chat: {
        data: {
          local
        }
      }
    } = getState()
    const currentChannel = local[chatId]
    if (currentChannel) {
      dispatch(setCurrentChannelAction({
        currentChannel: currentChannel.twilioChannel
      }))
      if (notRegistered) {
        dispatch(setMainMessageAction({
          mainMessage: "Hey! Let's connect and study together!"
        }))
      } else {
        const messageAttributes = {
          entityFirstName,
          entityLastName,
          imageKey: '',
          isVideoNotification: false,
          source: 'big_chat'
        }
        await sendMessage({
          message: "Hi! Let's chat and study together here!",
          ...messageAttributes,
          chatId
        })
      }
      if (entityVideo) {
        dispatch(push(`/video-call/${chatId}`))
      } else {
        dispatch(push('/chat'))
      }
    }
  }
};

export const handleInitChat = () =>
  async (dispatch: Dispatch, getState: Function) => {
    const {
      user: {
        data: { userId }
      },
      chat: {
        data: {
          client: curClient
        }
      }
    } = getState()

    try {
      dispatch(startLoading())

      if (curClient && curClient.connectionState === "connected") return
      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        setTimeout(handleInitChat, 2000);
        return;
      }

      const client = await Chat.create(accessToken, { logLevel: 'silent' });

      let paginator = await client.getSubscribedChannels();
      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }
      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });
      const local = {}

      const unreadCount = channel => {
        try{
          if (channel.lastMessage?.index === 0 && channel.lastConsumedMessageIndex === 0) {
            return 0
          }

          if (channel.lastMessage?.index > -1) {
            if (channel.lastConsumedMessageIndex === 0) {
              return channel.lastMessage.index - channel.lastConsumedMessageIndex
            }
            if (!channel.lastConsumedMessageIndex) {
              return channel.lastMessage.index + 1
            }
          }

          if (!channel.lastConsumedMessageIndex || !channel.lastMessage) return 0
          return channel.lastMessage.index - channel.lastConsumedMessageIndex
        } finally {}
      }

      channels.forEach(c => {
        local[c.sid] = {
          unread: unreadCount(c),
          twilioChannel: c,
        }
      })

      dispatch(initClient({ client }));
      dispatch(initChannels({ channels, local }))
      await initLocalChannels(dispatch, local)

      if (client._eventsCount === 0) {
        client.on('channelJoined', async channel => {
          const { sid } = channel
          setTimeout(async () => {
            const members = await fetchMembers(sid)
            dispatch(addChannel({ channel, userId, members }))
          }, 1000)
        });

        client.on('channelLeft', async channel => {
          const { sid } = channel
          dispatch(removeChannel({ sid }))
        })

        client.on('memberJoined',  member => {
          const update = async () => {
            const { channel: { sid } } = member
            const members = await fetchMembers(sid)
            dispatch(updateMembers({ members, channelId: sid }))
          }

          setTimeout(update, 1000)
        })

        client.on('memberLeft', async member => {
          dispatch(removeMember({ member }))
        })

        client.on('channelUpdated', async ({ channel }) => {
          dispatch(updateChannel({ channel, unread: unreadCount(channel) }));
        });

        client.on('messageAdded', async message => {
          const { channel } = message;
          dispatch(newMessage({ message }))
          dispatch(updateChannel({ channel, unread: unreadCount(channel) }));
        });

        client.on('tokenAboutToExpire', async () => {
          try{
            const newToken = await renewTwilioToken({
              userId
            });
            if (!newToken || (newToken && newToken === '')) {
              return;
            }
            await client.updateToken(newToken);
          } catch(e) {}
        });
      }
    } catch (err) {
      setTimeout(handleInitChat, 2000);
    }
  }

export const handleShutdownChat = () => async (dispatch: Dispatch, getState: Function) => {
  const {
    chat: { data: { client, channels } }
  } = getState()

  if (client) {
    try {
      client.removeAllListeners()
      channels.forEach(c => {
        c.removeAllListeners()
      })
      // client.shutdown();
    } catch (err) {}
  }
  dispatch(shutdown());
}

export const handleUpdateGroupPhoto = (
  channelSid: string,
  image: Blob,
  callback: Function
) => async (dispatch: Dispatch, getState: Function) => {
  const {
    user: { data: { userId } }
  } = getState();

  try {
    const result = await getPresignedURL({
      userId,
      type: 5,
      mediaType: image.type
    });

    const { url, readUrl, mediaId } = result;

    await axios.put(url, image, {
      headers: {
        'Content-Type': image.type
      }
    });

    await apiUpdateChat(channelSid, {
      chat_id: channelSid,
      thumbnail: mediaId
    });

    dispatch(updateChannelAttributes(channelSid, {
      thumbnail: readUrl
    }));

    if (callback) {
      callback();
    }
  } catch (err) {
  }
};

export const handleBlockUser = ({ blockedUserId }) => async () => {
  try {
    await blockChatUser({ blockedUserId });
  } catch (err) {}
}

export const handleMuteChannel = ({ sid }) => async (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { local } } }= getState()
  const { muted } = local[sid]
  const res = muted ? await unmuteChannel(sid) : await muteChannel(sid)
  if (res && res.success) dispatch(muteChannelLocal({ sid }));
}

export const handleMarkAsRead = (channel: Object) => async (dispatch: Dispatch) => {
  dispatch(updateChannel({ channel, unread: 0 }));
}

export const handleRemoveChannel = ({ sid }: { sid: string }) => async (dispatch: Dispatch) => {
  try {
    await leaveChat({ sid });
  } catch (err) {}
  dispatch(removeChannel({ sid }))
}

export const handleRoomClick = channel => async (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { openChannels } } } = getState()
  try {
    const availableSlots = getAvailableSlots(window.innerWidth);

    const newState = update(openChannels, {
      $apply: b => {
        if (availableSlots === 0) return [];
        const index = b.findIndex(item => item.sid === channel.sid);
        if (index > -1) {
          let newB = update(b, { $splice: [[index, 1]] });
          newB = update(newB, { $splice: [[availableSlots - 1]] });
          return [channel, ...newB];
        }
        const newB = update(b, { $splice: [[availableSlots - 1]] });
        return [channel, ...newB];
      }
    });
    if (channel) {
      const members = await fetchMembers(channel.sid)
      dispatch(updateMembers({ members, channelId: channel.sid }))
    }
    dispatch(setOpenChannels({ openChannels: newState }))
  } catch (err) {}
};

export const updateOpenChannels = () => async (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { openChannels } } } = getState()
  try {
    const availableSlots = getAvailableSlots(window.innerWidth);
    if (availableSlots === 0) {
      return;
    }

    if (availableSlots === 0) dispatch(setOpenChannels({ openChannels: [] }))
    const newState = update(openChannels, {
      $apply: b => {
        const newB = update(b, { $splice: [[availableSlots]] });
        return [...newB];
      }
    });
    dispatch(setOpenChannels({ openChannels: newState }))
  } catch (err) {}
};

export const handleChannelClose = (sid: string) => async (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { openChannels } } } = getState()
  dispatch(setOpenChannels({ openChannels: openChannels.filter(oc => oc.sid !== sid) }))
}

export const handleUpdateFriendlyName = (channel: Object) => async (dispatch: Dispatch) => {
  dispatch(updateFriendlyName({ channel }));
}
