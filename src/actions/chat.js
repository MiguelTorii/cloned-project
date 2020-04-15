/* eslint-disable import/prefer-default-export */
// @flow

import uuidv4 from 'uuid/v4';
import { renewTwilioToken, leaveChat, blockChatUser } from 'api/chat';
import Chat from 'twilio-chat';
import update from 'immutability-helper';
import { chatActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';

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

const initClient = ({ client }: { client: Object }): Action => ({
  type: chatActions.INIT_CLIENT_CHAT,
  payload: { client }
})

const initChannels = ({ channels }: { channels: array }): Action => ({
  type: chatActions.INIT_CHANNELS_CHAT,
  payload: { channels }
})

const updateChannel = ({ channel }: { channel: Object }): Action => ({
  type: chatActions.UPDATE_CHANNEL_CHAT,
  payload: { channel }
})

const addChannel = ({ channel }: { channel: Object }): Action => ({
  type: chatActions.ADD_CHANNEL_CHAT,
  payload: { channel }
})

const removeChannel = ({ sid }: { sid: string }): Action => ({
  type: chatActions.REMOVE_CHANNEL_CHAT,
  payload: { sid }
})

const shutdown = (): Action => ({
  type: chatActions.SHUTDOWN_CHAT,
})

const updateUnreadCount = ({ unread }: { unread: number }) => ({
  type: chatActions.UPDATE_UNREAD_COUNT_CHAT,
  payload: { unread }
})

const setOpenChannels = ({ openChannels }: { openChannels: array }) => ({
  type: chatActions.SET_OPEN_CHANNELS,
  payload: { openChannels }
})


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

export const handleInitChat = () =>
  async (dispatch: Dispatch, getState: Function) => {
    const {
      user: {
        data: { userId }
      },
    } = getState()

    try {
      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        setTimeout(handleInitChat, 2000);
        return;
      }

      const client = await Chat.create(accessToken);

      console.log(client)
      let paginator = await client.getSubscribedChannels();
      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }
      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });

      dispatch(initClient({ client }));
      dispatch(initChannels({ channels }))

      if (client._eventsCount === 0) {
        client.on('channelJoined', async channel => {
          dispatch(addChannel({ channel }));
        });

        client.on('channelLeft', async channel => {
          const { sid } = channel
          dispatch(removeChannel({ sid }))
        })

        client.on('channelUpdated', async ({ channel, updateReasons }) => {
          if (
            updateReasons.length > 0 &&
          updateReasons.indexOf('lastMessage') > -1
          ) {
            dispatch(updateChannel({ channel }));
          }
        });

        client.on('messageAdded', async message => {
          const { channel } = message;
          dispatch(newMessage({ message }))
          dispatch(updateChannel({ channel }));
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
    chat: { data: { client }}
  } = getState()

  if (client) {
    try {
      client.shutdown();
    } catch (err) {}
  }
  dispatch(shutdown());
}

export const handleUpdateUnreadCount = (unread) => async (dispatch: Dispatch) => {
  if(unread) dispatch(updateUnreadCount({ unread }))
}

export const handleLeaveChat = ({ sid }) => async () => {
  try {
    await leaveChat({ sid });
  } catch (err) {}
}

export const handleBlockUser = ({ blockedUserId }) => async () => {
  try {
    await blockChatUser({ blockedUserId });
  } catch (err) {}
}

export const handleRemoveChannel = ({ sid }: { sid: string }) => async (dispatch: Dispatch) => {
  dispatch(removeChannel({ sid }))
}


const getAvailableSlots = width => {
  try {
    const chatSize = 320;
    return Math.trunc((width - chatSize) / chatSize);
  } catch (err) {
    return 0;
  }
};

export const handleRoomClick = channel => async (dispatch: Dispatch, getState: Function) => {
  const { chat: { data: { openChannels }}} = getState()
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
  const { chat: { data: { openChannels }}} = getState()
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
  const { chat: { data: { openChannels }}} = getState()
  dispatch(setOpenChannels({ openChannels: openChannels.filter(oc => oc.sid !== sid) }))
}

