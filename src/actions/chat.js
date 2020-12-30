/* eslint-disable import/prefer-default-export */
// @flow

import uuidv4 from 'uuid/v4';
import {
  getGroupMembers,
  getChannels,
  muteChannel,
  unmuteChannel,
  renewTwilioToken,
  leaveChat,
  blockChatUser
} from 'api/chat';
import Chat from 'twilio-chat';
import update from 'immutability-helper';
import { chatActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

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
  type: chatActions.START_LOADING,
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

const createNewChannel = ({ newChannel, openChannels }: { newChannel: boolean, openChannels: array }) => ({
  type: chatActions.CREATE_NEW_CHANNEL,
  payload: { newChannel, openChannels }
})

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

export const openChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityVideo
}: {
  entityId: string,
  entityFirstName: string,
  entityLastName: string,
  entityVideo: boolean
}) => async (dispatch: Dispatch) => {
  dispatch(
    requestStartChannelWithEntity({
      entityId,
      entityFirstName,
      entityLastName,
      entityVideo,
      entityUuid: uuidv4()
    })
  );
};

const initLocalChannels = async dispatch => {
  try {
    dispatch(startLoading())
    const local = await getChannels()
    dispatch(initLocal({ local }))
  } catch (e) {
    console.log(e)
  }
}

const fetchMembers = async sid => {
  const res = await getGroupMembers({ chatId: sid })
  const members = res.map(m => ({
    firstname: m.firstName,
    lastname: m.lastName,
    image: m.profileImageUrl,
    roleId: m.roleId,
    role: m.role,
    userId: m.userId
  }))
  return members
}

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
      initLocalChannels(dispatch)
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

