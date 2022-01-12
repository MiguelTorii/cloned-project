/* eslint-disable import/prefer-default-export */
import uuidv4 from 'uuid/v4';
import Chat, { Client } from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel';
import update from 'immutability-helper';
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
} from '../api/chat';
import { chatActions } from '../constants/action-types';
import type { Action } from '../types/action';
import type { Dispatch } from '../types/store';
import { uploadMedia } from './user';
import { ChannelWrapper, CurrentCommunity } from '../reducers/chat';
import { APICommunity, APICommunityData } from '../api/models/APICommunity';

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

const newMessage = ({ message }): Action => ({
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

const updateMembers = ({
  members,
  channelId
}: {
  channelId: string;
  members: Record<string, any>;
}): Action => ({
  type: chatActions.UPDATE_MEMBERS_CHAT,
  payload: {
    members,
    channelId
  }
});

const removeMember = ({ member }: { member: Record<string, any> }): Action => ({
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

const shutdown = (): Action => ({
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
export const setCurrentCommunityAction = (channel: CurrentCommunity | APICommunityData | null) => ({
  type: chatActions.SET_CURRENT_COMMUNITY,
  payload: {
    channel
  }
});

const setCurrentCommunityChannelAction = ({
  currentChannel
}: {
  currentChannel: Record<string, any>;
}) => ({
  type: chatActions.SET_CURRENT_COMMUNITY_CHANNEL,
  payload: {
    currentChannel
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

export const setCommunitiesAction = (communities: APICommunity[]) => ({
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

const fetchMembers = async (sid) => {
  const res = await getGroupMembers({
    chatId: sid
  });
  const members = res.map((m) => ({
    registered: m.registered,
    firstname: m.firstName,
    lastname: m.lastName,
    image: m.profileImageUrl,
    roleId: m.roleId,
    role: m.role,
    userId: m.userId,
    isOnline: m.isOnline
  }));
  return members;
};

export const setCurrentCommunity = (channel) => async (dispatch: Dispatch) => {
  if (channel) {
    dispatch(setCurrentCommunityAction(channel));
  }
};

export const setCurrentChannel = (currentChannel) => async (dispatch: Dispatch) => {
  if (currentChannel) {
    localStorage.setItem('currentDMChannel', currentChannel.sid);
    const [members, shareLink] = await Promise.all([
      fetchMembers(currentChannel.sid),
      getShareLink(currentChannel.sid)
    ]);

    // TODO CHAT_REFACTOR: Move logic into a chat hook and stop resetting the
    // user's selected navigation state after some arbitrary amount of time,
    // i.e. after we have finished "awaiting" the promise result.
    dispatch(
      updateMembers({
        members,
        channelId: currentChannel.sid
      })
    );
    dispatch(
      setCurrentChannelAction({
        currentChannel
      })
    );
    dispatch(
      updateShareLink({
        shareLink,
        channelId: currentChannel.sid
      })
    );
  } else {
    localStorage.removeItem('currentDMChannel');
    dispatch(
      setCurrentChannelAction({
        currentChannel: null
      })
    );
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
    dispatch(
      updateMembers({
        members,
        channelId: currentChannel.sid
      })
    );
    dispatch(
      setCurrentCommunityChannelAction({
        currentChannel
      })
    );
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

const initLocalChannels = async (dispatch, currentLocal = {}) => {
  try {
    const local = await getChannels();

    // TODO CHAT_REFACTOR: Move logic into a chat hook and stop resetting the
    // user's selected navigation state after some arbitrary amount of time,
    // i.e. after we have finished "awaiting" the promise result.
    if (
      Object.keys(local).length > 0 &&
      Object.keys(currentLocal).length > 0 &&
      !localStorage.getItem('currentDMChannel')
    ) {
      let channelList: string[] = [];
      channelList = Object.keys(local).filter((l) => !local[l].lastMessage.message);
      const recentMessageChannels = Object.keys(local).filter((l) => local[l].lastMessage.message);

      if (recentMessageChannels.length) {
        channelList = recentMessageChannels.sort(
          (a, b) =>
            moment(local[b].lastMessage.date).valueOf() -
            moment(local[a].lastMessage.date).valueOf()
        );
      }

      /**
       * Set the default current channel id if there is no previus selected channel
       * Save channel Id for checking the messages from another channel
       */
      dispatch(setCurrentChannelSidAction(channelList[0]));
      setCurrentChannel(currentLocal[channelList[0]]?.twilioChannel)(dispatch);
    } else if (localStorage.getItem('currentDMChannel')) {
      const lastChannelId = localStorage.getItem('currentDMChannel');
      dispatch(setCurrentChannelSidAction(lastChannelId || ''));
      setCurrentChannel(currentLocal?.[lastChannelId]?.twilioChannel)(dispatch);
    }

    dispatch(
      initLocal({
        local
      })
    );
  } catch (e) {
    console.log(e);
  }
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
        localStorage.setItem('currentDMChannel', channel.sid);
        const [members, shareLink] = await Promise.all([
          fetchMembers(channel.sid),
          getShareLink(channel.sid)
        ]);
        dispatch(
          updateMembers({
            members,
            channelId: channel.sid
          })
        );
        dispatch(
          updateShareLink({
            shareLink,
            channelId: channel.sid
          })
        );
        dispatch(setCurrentChannelSidAction(channel.sid));
        dispatch(
          setCurrentChannelAction({
            currentChannel: channel
          })
        );

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
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      user: {
        data: { userId }
      },
      chat: {
        data: { client: curClient }
      }
    } = getState();

    try {
      dispatch(startLoading());

      if (curClient && curClient.connectionState === 'connected') {
        return;
      }

      const accessToken = await renewTwilioToken({
        userId
      });

      if (!accessToken || (accessToken && accessToken === '')) {
        setTimeout(handleInitChat, 2000);
        return;
      }

      const client: Client = await Chat.create(accessToken, {
        logLevel: 'silent'
      });
      let paginator = await client.getSubscribedChannels();

      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }

      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });
      const local = {};

      const unreadCount = async (channel) => {
        const count = await channel.getMessagesCount();
        let unreadCount;

        if (channel.lastConsumedMessageIndex === null) {
          unreadCount = count;
        } else if (channel.lastConsumedMessageIndex + 1 > count) {
          unreadCount = 0; // check the channel is new or check lastConsumedMessageIndex is bigger than message count
        } else {
          unreadCount = count - (channel.lastConsumedMessageIndex + 1);
        }

        return {
          [channel.sid]: unreadCount
        };
      };

      const promises = channels.map((channel) => unreadCount(channel));
      const unreadMessages = await Promise.all(promises);
      channels.forEach((c, key) => {
        local[c.sid] = {
          unread: unreadMessages[key][c.sid],
          twilioChannel: c
        };
      });
      dispatch(
        initClient({
          client
        })
      );
      dispatch(
        initChannels({
          channels,
          local
        })
      );
      await initLocalChannels(dispatch, local);

      if ((client as any)._eventsCount === 0) {
        client.on('channelJoined', async (channel) => {
          const { sid } = channel;
          setTimeout(async () => {
            const members = await fetchMembers(sid);
            dispatch(
              addChannel({
                channel,
                userId,
                members
              })
            );
          }, 2000);
        });
        client.on('channelLeft', async (channel) => {
          const { sid } = channel;
          dispatch(
            removeChannel({
              sid
            })
          );
        });
        client.on('memberJoined', (member) => {
          const update = async () => {
            const {
              channel: { sid }
            } = member;
            const members = await fetchMembers(sid);
            dispatch(
              updateMembers({
                members,
                channelId: sid
              })
            );
          };

          setTimeout(update, 1000);
        });
        client.on('memberLeft', async (member) => {
          dispatch(
            removeMember({
              member
            })
          );
        });
        client.on('channelUpdated', async ({ channel }) => {
          const unreadMessageCount = await unreadCount(channel);
          dispatch(
            updateChannel({
              channel,
              unread: unreadMessageCount[channel.sid]
            })
          );
        });
        client.on('messageAdded', async (message) => {
          const { channel } = message;
          const unreadMessageCount = await unreadCount(channel);
          dispatch(
            newMessage({
              message
            })
          );
          dispatch(
            updateChannel({
              channel,
              unread: unreadMessageCount[channel.sid]
            })
          );
        });
        client.on('tokenAboutToExpire', async () => {
          try {
            const newToken = await renewTwilioToken({
              userId
            });

            if (!newToken || (newToken && newToken === '')) {
              return;
            }

            await client.updateToken(newToken);
          } catch (e) {}
        });
      }
    } catch (err) {
      setTimeout(handleInitChat, 2000);
    }
  };
export const handleShutdownChat =
  () => async (dispatch: Dispatch, getState: (...args: Array<any>) => any) => {
    const {
      chat: {
        data: { client, channels }
      }
    } = getState();

    if (client) {
      try {
        client.removeAllListeners();
        channels.forEach((c) => {
          c.removeAllListeners();
        });
      } catch (err) {}
    }

    dispatch(shutdown());
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
    await leaveChat({
      sid
    });
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
