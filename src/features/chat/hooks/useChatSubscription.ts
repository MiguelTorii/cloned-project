import { useCallback, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import produce from 'immer';
import { objectToCamel } from 'ts-case-convert';
import { Channel } from 'twilio-chat';
import { usePrevious } from 'hooks';

import moment from 'moment';
import { getGroupMembers, getShareLink } from 'api/chat';
import { getGroupTitle } from 'utils/chat';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { CustomMessageAttributes } from 'types/models';
import {
  fetchMembers,
  handleInitChat,
  messageLoadingAction,
  newMessage,
  removeMember,
  setCurrentChannelSidAction,
  shutdown,
  updateMembers
} from 'actions/chat';
import { getChannelsFromClient, isPaginatorDone, resetChannels } from 'lib/chat';
import {
  ChannelsMetadata,
  getTransformedChannelsMetada,
  QUERY_KEY_CHANNEL_METADATA,
  QUERY_KEY_CHANNELS,
  UNREAD_COUNT_QUERY_KEY,
  Unreads,
  useChatClient,
  useOrderedChannelList,
  useChannels,
  SHARE_LINK_KEY
} from 'features/chat';

export const useChatSubscription = () => {
  useHandleClient();
  usePreloadChat();
  useChannelLeaveSubscription();
  useChannelJoinedSubscription();
  useChannelMessageAddedSubscription();
  useChannelUpdatedSubscription();
  useMemberJoinedSubscription();
  useMemberLeftSubscription();
};

const useHandleClient = () => {
  const client = useChatClient();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data.userId);
  const prevUserId = usePrevious(userId);
  const { data: channels } = useChannels();

  // Handle init
  useEffect(() => {
    if (!client || !userId) {
      return;
    }

    const hasSubscribedToRemainingEvents = Object.keys((client as any)._events).filter((key) =>
      ['tokenAboutToExpire'].includes(key)
    )?.length;

    if (!hasSubscribedToRemainingEvents) {
      dispatch(handleInitChat(client));
    }
  }, [client, dispatch, prevUserId, userId]);

  // Handle shutdown
  useEffect(() => {
    if (!client || !channels?.length || userId || !(!userId && prevUserId)) {
      return;
    }

    client.removeAllListeners();
    client.shutdown();
    channels.forEach((c) => {
      c.removeAllListeners();
    });
    dispatch(shutdown());
    resetChannels();
  }, [channels, client, dispatch, prevUserId, userId]);
};

const usePreloadChat = () => {
  const client = useChatClient();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    const preloadChat = async () => {
      if (!userId || !client) {
        return;
      }

      Promise.all([
        queryClient.prefetchQuery(QUERY_KEY_CHANNELS, async () => getChannelsFromClient(client)),
        queryClient.prefetchQuery(QUERY_KEY_CHANNEL_METADATA, getTransformedChannelsMetada)
      ]);
    };

    preloadChat();
  }, [client, queryClient, userId]);
};

const useChannelJoinedSubscription = () => {
  const client = useChatClient();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    if (!userId || !client) {
      return;
    }

    client.on('channelJoined', async (channel) => {
      if (!isPaginatorDone()) {
        return;
      }

      queryClient.setQueryData<Channel[]>(QUERY_KEY_CHANNELS, (currentChannels) => [
        ...(currentChannels || []),
        channel
      ]);

      dispatch(messageLoadingAction(true));

      queryClient.setQueryData<Unreads>(UNREAD_COUNT_QUERY_KEY, (currentUnreads) => {
        const newUnreads = produce(currentUnreads, (draft) => {
          if (draft) {
            draft[channel.sid] = 0;
          }
        });
        return newUnreads || { [channel.sid]: 0 };
      });

      const isCommunityChat = channel.attributes.community_id;

      if (isCommunityChat) return;

      queryClient.prefetchQuery([SHARE_LINK_KEY, channel.sid], () => getShareLink(channel.sid));

      setTimeout(async () => {
        // Put new channel first
        const users = await getGroupMembers(channel.sid);
        const metadata = queryClient.getQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA);
        if (metadata) {
          const nextMetadata = produce(metadata, (draft) => {
            draft[channel.sid] = {
              id: channel.sid,
              groupName: getGroupTitle(userId, users),
              // TODO Fix API call
              // isTutor, school, email properties are missing
              users: users.map((user) => objectToCamel(user)),
              lastReceivedMessage: {
                message: '',
                // TODO need to refetch actual data from API from individual channel endpoint
                user: users.find((user) => user.userId !== userId)!,
                dateSent: moment().toISOString()
              },
              isMuted: false,
              thumbnail: '',
              showFirst: true
            };
          });

          queryClient.setQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA, nextMetadata);
          // TODO Improve performance when creating new chat
          // Currently there's too big of a delay when changing channels and the previously selected channel still shows for a second
          dispatch(setCurrentChannelSidAction(channel.sid));
        }
      }, 1500);
    });

    return () => {
      client?.removeAllListeners('channelJoined');
    };
  }, [client, dispatch, queryClient, userId]);
};

const useChannelLeaveSubscription = () => {
  const client = useChatClient();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);
  const selectedChannelId = useAppSelector((state) => state.chat.data.selectedChannelId);
  const channelList = useOrderedChannelList();

  useEffect(() => {
    if (!userId || !client || !channelList.length) {
      return;
    }

    client.on('channelLeft', async (channel) => {
      // If the ID is the same as the current channel, set the current channel to the first channel in the list
      if (channel.sid === selectedChannelId) {
        const nextSelectedChannelId = channelList.filter((id) => id !== channel.sid)[0];
        // TODO Replace with redux action dispatch
        dispatch(setCurrentChannelSidAction(nextSelectedChannelId));
      }

      // Both API calls and calls to the client to refetch channels are expensive (1s>) so it's's better to manually change the cache
      // https://github.com/tannerlinsley/react-query/discussions/3313#discussioncomment-2209061

      const channelCache = queryClient.getQueryData<Channel[]>(QUERY_KEY_CHANNELS);
      if (channelCache) {
        queryClient.setQueryData<Channel[]>(
          QUERY_KEY_CHANNELS,
          channelCache.filter((c) => c.sid !== channel.sid)
        );
      }

      const isCommunityChat = channel.attributes.community_id;

      if (isCommunityChat) {
        return;
      }

      const metadataCache = queryClient.getQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA);
      if (metadataCache) {
        const nextMetadata = produce(metadataCache, (draft) => {
          delete draft[channel.sid];
        });
        queryClient.setQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA, nextMetadata);
      }
    });

    return () => {
      client?.removeAllListeners('channelLeft');
    };
  }, [channelList, client, dispatch, queryClient, selectedChannelId, userId]);
};

const useChannelMessageAddedSubscription = () => {
  const dispatch = useAppDispatch();
  const client = useChatClient();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);
  const pathname = useAppSelector((state) => state.router.location.pathname);
  const selectedChannelId = useAppSelector((state) => state.chat.data.selectedChannelId);

  useEffect(() => {
    if (!userId || !client) {
      return;
    }

    client.on('messageAdded', async (message) => {
      // TODO: Replace with message cache
      dispatch(
        newMessage({
          message
        })
      );

      /**
       *  TODO update metadata lastReceivedMessage
       * date_sent: string;
       * message: string;
       * user: APIChatUser;
       *
       * fetch user from message
       * rather than refetch, find APIChatUser from channel's users array?
       */

      // Do not set new unread if user is looking at current chat
      if (pathname === '/chat' && message.channel.sid !== selectedChannelId) {
        // Update message count
        queryClient.invalidateQueries([UNREAD_COUNT_QUERY_KEY, message.channel.sid]);
        // Other unreadCount hooks use an API call that fetches all channels' unread messages
        // To prevent refetching for all channels, we update cache just the specific channel

        const unreadCache = queryClient.getQueryData<Unreads>([UNREAD_COUNT_QUERY_KEY]);
        if (unreadCache) {
          const nextUnread = produce(unreadCache, (draft) => {
            draft[message.channel.sid] = (draft[message.channel.sid] || 0) + 1;
          });
          queryClient.setQueryData<Unreads>(UNREAD_COUNT_QUERY_KEY, nextUnread);
        }
      }

      const isCommunityChat = message.channel.attributes.community_id;

      if (isCommunityChat) {
        return;
      }

      // Update lastMessage
      const metadataCache = queryClient.getQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA);
      if (metadataCache) {
        const nextMetadata = produce(metadataCache, (draft) => {
          const users = draft[message.channel.sid].users;
          draft[message.channel.sid].lastReceivedMessage = {
            user: users.find((user) => user.userId === Number(message.author)),
            message: message.body,
            dateSent: moment(message.dateCreated).toISOString()
          };
        });
        queryClient.setQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA, nextMetadata);
      }
    });

    return () => {
      client?.removeAllListeners('messageAdded');
    };
  }, [client, dispatch, pathname, queryClient, selectedChannelId, userId]);
};

const useChannelUpdatedSubscription = () => {
  const dispatch = useAppDispatch();
  const client = useChatClient();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    if (!userId || !client) {
      return;
    }

    client.on('channelUpdated', async (data) => {
      const reasons = ['lastConsumedMessageIndex'];
      // TODO Handle lastMessage event, create query cache for messages
      // These should be handled optimistically
      const { channel, updateReasons } = data;
      if (updateReasons.filter((reason) => !reasons.includes(reason)).length === 0) {
        return;
      }
      const channelCache = queryClient.getQueryData<Channel[]>([QUERY_KEY_CHANNELS]);
      if (channelCache) {
        const nextCache = produce(channelCache, (draft) => {
          // Keep current order
          const indexOfChannel = channelCache.findIndex((c) => c.sid === channel.sid);
          draft[indexOfChannel] = channel;
        });
        queryClient.setQueryData<Channel[]>(QUERY_KEY_CHANNELS, nextCache);
      }
    });

    return () => {
      client?.removeAllListeners('channelUpdated');
    };
  }, [client, dispatch, queryClient, userId]);
};

const useMemberJoinedSubscription = () => {
  const dispatch = useAppDispatch();
  const client = useChatClient();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    if (!userId || !client) {
      return;
    }

    client.on('memberJoined', async (member) => {
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

        const metadata = queryClient.getQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA);
        if (metadata) {
          const nextMetadata = produce(metadata, (draft) => {
            draft[sid].users = members;
          });

          queryClient.setQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA, nextMetadata);
        }
      };

      setTimeout(update, 1000);
    });

    return () => {
      client?.removeAllListeners('memberJoined');
    };
  }, [client, dispatch, queryClient, userId]);
};

const useMemberLeftSubscription = () => {
  const dispatch = useAppDispatch();
  const client = useChatClient();
  const queryClient = useQueryClient();
  const userId = useAppSelector((state) => state.user.data.userId);

  useEffect(() => {
    if (!userId || !client) {
      return;
    }

    client.on('memberLeft', async (member) => {
      if (member.identity !== userId) {
        dispatch(
          removeMember({
            member
          })
        );
      }

      const metadata = queryClient.getQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA);
      if (metadata) {
        const nextMetadata = produce(metadata, (draft) => {
          const users = draft[member.channel.sid].users;
          draft[member.channel.sid].users = users.filter(
            (user) => String(user.userId) !== String(member.identity)
          );
        });

        queryClient.setQueryData<ChannelsMetadata>(QUERY_KEY_CHANNEL_METADATA, nextMetadata);
      }
    });

    return () => {
      client?.removeAllListeners('memberLeft');
    };
  }, [client, dispatch, queryClient, userId]);
};

// TODO Replace repetitive immer updates with custom function
// TODO Need to fix with correct types
const useQueryUpdater = () => {
  const queryClient = useQueryClient();

  const updateCacheTypeSafely = useCallback(
    <T>(key: string, updater: Parameters<typeof produce>[1]) => {
      const currentCache = queryClient.getQueryData<T>(key);
      if (currentCache) {
        const nextCache = produce(currentCache, updater);

        queryClient.setQueryData<T>(key, nextCache);
      }
    },
    [queryClient]
  );

  return updateCacheTypeSafely;
};
