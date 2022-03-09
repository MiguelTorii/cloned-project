/* eslint-disable import/prefer-default-export */
import uuidv4 from 'uuid/v4';
import update from 'immutability-helper';
import { Channel, Client } from 'twilio-chat';
import { push } from 'connected-react-router';
import moment from 'moment';
import {
  getGroupMembers,
  getShareLink,
  getChannels,
  muteChannel,
  unmuteChannel,
  renewTwilioToken,
  leaveChat,
  createChannel,
  apiUpdateChat
} from 'api/chat';
import { chatActions } from 'constants/action-types';
import type { Action } from 'types/action';
import type { Dispatch } from 'types/store';
import { uploadMedia } from './user';
import { ChannelWrapper, CurrentCommunity } from 'reducers/chat';
import { ChatCommunityData, ChatCommunity } from 'api/models/APICommunity';
import { ChannelMetadata, SHARE_LINK_KEY } from 'features/chat';
import { queryClient } from 'lib/query';

const getAvailableSlots = (width) => {
  try {
    const chatSize = 320;
    return Math.trunc((width - chatSize) / chatSize);
  } catch (err) {
    return 0;
  }
};

const requestStartChannelWithEntity = ({
  entityId,
  entityFirstName,
  entityLastName,
  entityVideo,
  entityUuid
}: {
  entityId: number;
  entityFirstName: string;
  entityLastName: string;
  entityVideo: boolean;
  entityUuid: string;
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

export const newMessage = ({ message }): Action => ({
  type: chatActions.NEW_CHAT_MESSAGE,
  payload: {
    message
  }
});
const startLoading = (): Action => ({
  type: chatActions.CHAT_START_LOADING
});

const initLocal = ({ local }: { local: Record<string, ChannelWrapper> }): Action => ({
  type: chatActions.INIT_LOCAL_CHAT,
  payload: {
    local
  }
});

const initClient = ({ client }: { client: Record<string, any> }): Action => ({
  type: chatActions.INIT_CLIENT_CHAT,
  payload: {
    client
  }
});

const initChannels = ({
  channels,
  local
}: {
  channels: any[];
  local: Record<string, ChannelWrapper>;
}): Action => ({
  type: chatActions.INIT_CHANNELS_CHAT,
  payload: {
    channels,
    local
  }
});

export const messageLoadingAction = (loading) => ({
  type: chatActions.MAIN_MESSAGE_LOADING,
  payload: {
    loading
  }
});

export const updateChannel = ({
  channel,
  unread
}: {
  channel: Record<string, any>;
  unread: number;
}): Action => ({
  type: chatActions.UPDATE_CHANNEL_CHAT,
  payload: {
    channel,
    unread
  }
});

const updateShareLink = ({
  shareLink,
  channelId
}: {
  channelId: string;
  shareLink: string;
}): Action => ({
  type: chatActions.UPDATE_SHARE_LINK_CHAT,
  payload: {
    shareLink,
    channelId
  }
});

export const updateMembers = ({
  members,
  channelId
}: {
  channelId: string;
  members: ChannelMetadata['users'];
}): Action => ({
  type: chatActions.UPDATE_MEMBERS_CHAT,
  payload: {
    members,
    channelId
  }
});

export const removeMember = ({ member }: { member: Record<string, any> }): Action => ({
  type: chatActions.REMOVE_MEMBER_CHAT,
  payload: {
    member
  }
});

const addChannel = ({
  members,
  userId,
  channel,
  unread
}: {
  channel: Record<string, any>;
  unread?: number;
  userId?: string;
  members: any[];
}): Action => ({
  type: chatActions.ADD_CHANNEL_CHAT,
  payload: {
    userId,
    channel,
    unread,
    members
  }
});

const removeChannel = ({ sid }: { sid: string }): Action => ({
  type: chatActions.REMOVE_CHANNEL_CHAT,
  payload: {
    sid
  }
});

export const closeNewChannelAction = () => ({
  type: chatActions.CLOSE_NEW_CHANNEL
});

export const shutdown = (): Action => ({
  type: chatActions.SHUTDOWN_CHAT
});

const setOpenChannels = ({ openChannels }: { openChannels: any[] }) => ({
  type: chatActions.SET_OPEN_CHANNELS,
  payload: {
    openChannels
  }
});

const muteChannelLocal = ({ sid }: { sid: string }) => ({
  type: chatActions.MUTE_CHANNEL,
  payload: {
    sid
  }
});

const setCurrentChannelAction = ({
  currentChannel
}: {
  currentChannel: Record<string, any> | null;
}) => ({
  type: chatActions.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel
  }
});

export const setCurrentChannelSidAction = (selectedChannelId: string) => ({
  type: chatActions.SET_CURRENT_CHANNEL_ID,
  payload: {
    selectedChannelId
  }
});

// TODO resolve the type discrepancy between CurrentCommunity and APICommunityData
export const setCurrentCommunityAction = (channel: CurrentCommunity | ChatCommunity | null) => ({
  type: chatActions.SET_CURRENT_COMMUNITY,
  payload: {
    channel
  }
});

const setCurrentCommunityChannelIdAction = (currentChannelId: string) => ({
  type: chatActions.SET_CURRENT_COMMUNITY_CHANNEL_ID,
  payload: {
    currentChannelId
  }
});

export const setCurrentCommunityIdAction = (currentCommunityId: number | null) => ({
  type: chatActions.SET_CURRENT_COMMUNITY_ID,
  payload: {
    currentCommunityId
  }
});

export const setOneTouchSendAction = (open: boolean) => ({
  type: chatActions.SET_OPEN_ONE_TOUCH_SEND,
  payload: {
    open
  }
});

const createNewChannel = ({
  newChannel,
  openChannels
}: {
  newChannel: boolean;
  openChannels: any[];
}) => ({
  type: chatActions.CREATE_NEW_CHANNEL,
  payload: {
    newChannel,
    openChannels
  }
});

export const setCommunitiesAction = (communities: ChatCommunityData[]) => ({
  type: chatActions.SET_COMMUNITIES,
  payload: {
    communities
  }
});

export const setCommunityChannelsAction = (communityChannels: Array<any>) => ({
  type: chatActions.SET_COMMUNITY_CHANNELS,
  payload: {
    communityChannels
  }
});

export const updateFriendlyName = (channel: Record<string, any>) => ({
  type: chatActions.UPDATE_FRIENDLY_NAME,
  payload: {
    channel
  }
});

export const updateChannelAttributes = (channelSid: string, attributes: Record<string, any>) => ({
  type: chatActions.UPDATE_CHANNEL_ATTRIBUTES,
  payload: {
    sid: channelSid,
    attributes
  }
});

export const fetchMembers = async (sid): Promise<ChannelMetadata['users']> => {
  const members = await getGroupMembers(sid);
  return members;
};

export const setCurrentCommunity = (channel) => async (dispatch: Dispatch) => {
  if (channel) {
    dispatch(setCurrentCommunityAction(channel));
  }
};


export const setCurrentCommunityChannel = (currentChannel) => async (dispatch: Dispatch) => {
  if (currentChannel) {
    const [members, shareLink] = await Promise.all([
      fetchMembers(currentChannel.sid),
      getShareLink(currentChannel.sid)
    ]);

    // TODO CHAT_REFACTOR: Move logic into a chat hook and stop resetting the
    // user's selected navigation state after some arbitrary amount of time,
    // i.e. after we have finished "awaiting" the promise result.
    // TODO Currently community channels users are held in redux, should be changed to react-query but channelMetadata doesn't fit the community channel model
    dispatch(
      updateMembers({
        members,
        channelId: currentChannel.sid
      })
    );
    dispatch(setCurrentCommunityChannelIdAction(currentChannel.sid));
    dispatch(
      updateShareLink({
        shareLink,
        channelId: currentChannel.sid
      })
    );
  }
};

export const setCurrentCommunityId = (currentCommunityId) => (dispatch: Dispatch) => {
  dispatch(setCurrentCommunityIdAction(currentCommunityId));
};
export const closeNewChannel = () => (dispatch: Dispatch) => {
  dispatch(closeNewChannelAction());
};
export const handleNewChannel =
  (newChannel: boolean, openChannels: Channel[]) => (dispatch: Dispatch) => {
    const availableSlots = getAvailableSlots(window.innerWidth);
    const newState = update(openChannels || [], {
      $apply: (b) => {
        const newB = update(b, {
          $splice: [[availableSlots - 1]]
        });
        return [...newB];
      }
    });
    dispatch(
      createNewChannel({
        newChannel,
        openChannels: newState
      })
    );
  };

export const openChannelWithEntity =
  ({
    entityId,
    entityFirstName,
    entityLastName,
    entityVideo,
    fullscreen = false,
    isHud,
    client
  }: {
    entityId: number;
    entityFirstName: string;
    entityLastName: string;
    entityVideo: boolean;
    fullscreen: boolean;
    isHud: boolean;
    client: Client;
  }) =>
  async (dispatch: Dispatch) => {
    if (!isHud && !fullscreen) {
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
      // Create Channel with users

      const { chatId } = await createChannel({
        users: [Number(entityId)]
      });
      // Get Created Channel By Chat Id
      const channel = await client.getChannelBySid(chatId);

      if (channel) {
        // TODO CHAT_REFACTOR: Move logic into a chat hook and stop resetting the
        // user's selected navigation state after some arbitrary amount of time,
        // i.e. after we have finished "awaiting" the promise results.
        // The user state could have changed, and maybe some other channel besides
        // this channel was selected as the current channel.
        // If that occurred, this code resets the state erroneously.
        dispatch(setCurrentChannelSidAction(channel.sid));

        if (entityVideo) {
          dispatch(push(`/video-call/${chatId}`));
        } else {
          dispatch(push('/chat'));
        }
      }
    }
  };

// TODO CHAT_REFACTOR: Move logic into a chat hook.
export const handleInitChat =
  (client: Client) => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      user: {
        data: { userId }
      }
    } = getState();

    dispatch(
      initLocal({
        local: {}
      })
    );

    client.on('tokenAboutToExpire', async () => {
      try {
        const newToken = await renewTwilioToken(userId);

        if (!newToken) {
          return;
        }

        await client.updateToken(newToken);
      } catch (e) {}
    });
  };

export const handleUpdateGroupPhoto =
  (channelSid: string, image: Blob, callback: (...args: Array<any>) => any) =>
  async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      user: {
        data: { userId }
      }
    } = getState();

    const result = await uploadMedia(userId, 5, image);
    const { readUrl, mediaId } = result;
    await apiUpdateChat({
      chat_id: channelSid,
      thumbnail: mediaId
    });
    dispatch(
      updateChannelAttributes(channelSid, {
        thumbnail: readUrl
      })
    );

    if (callback) {
      callback();
    }
  };

export const handleMuteChannel =
  ({ sid }) =>
  async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      chat: {
        data: { local }
      }
    } = getState();
    const { muted } = local[sid];
    const res = muted ? await unmuteChannel(sid) : await muteChannel(sid);

    if (res && res.success) {
      dispatch(
        muteChannelLocal({
          sid
        })
      );
    }
  };
export const handleRemoveChannel = (sid: string) => async (dispatch: Dispatch) => {
  try {
    await leaveChat(sid);
  } catch (err) {}

  dispatch(
    removeChannel({
      sid
    })
  );
};
export const handleRoomClick =
  (channel) => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      chat: {
        data: { openChannels }
      }
    } = getState();

    try {
      const availableSlots = getAvailableSlots(window.innerWidth);
      const newState = update(openChannels, {
        $apply: (b) => {
          if (availableSlots === 0) {
            return [];
          }

          const index = b.findIndex((item) => item.sid === channel.sid);

          if (index > -1) {
            let newB = update(b, {
              $splice: [[index, 1]]
            });
            newB = update(newB, {
              $splice: [[availableSlots - 1]]
            });
            return [channel, ...newB];
          }

          const newB = update(b, {
            $splice: [[availableSlots - 1]]
          });
          return [channel, ...newB];
        }
      });

      if (channel) {
        const members = await fetchMembers(channel.sid);
        dispatch(
          updateMembers({
            members,
            channelId: channel.sid
          })
        );
      }

      dispatch(
        setOpenChannels({
          openChannels: newState
        })
      );
    } catch (err) {}
  };
export const updateOpenChannels =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      chat: {
        data: { openChannels }
      }
    } = getState();

    const availableSlots = getAvailableSlots(window.innerWidth);

    if (availableSlots === 0) {
      return;
    }

    if (availableSlots === 0) {
      dispatch(
        setOpenChannels({
          openChannels: []
        })
      );
    }

    const newState = update(openChannels, {
      $apply: (b) => {
        const newB = update(b, {
          $splice: [[availableSlots]]
        });
        return [...newB];
      }
    });
    dispatch(
      setOpenChannels({
        openChannels: newState
      })
    );
  };
export const handleChannelClose =
  (sid: string) => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      chat: {
        data: { openChannels }
      }
    } = getState();
    dispatch(
      setOpenChannels({
        openChannels: openChannels.filter((oc) => oc.sid !== sid)
      })
    );
  };
