import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import { getCommunities, getCommunityChannels } from '../../api/community';
import * as chatActions from '../../actions/chat';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';
import useStyles from './_styles/styles';
import type { State as StoreState } from '../../types/state';

type Props = {
  chat?: any;
  setCurrentCommunityId?: any;
  setCommunityList?: any;
  setCommunityChannels?: any;
  setCurrentCommunity?: any;
  setCurrentChannelSid?: any;
};

const ChatPage = ({
  chat,
  setCurrentCommunityId,
  setCommunityList,
  setCommunityChannels,
  setCurrentCommunity,
  setCurrentChannelSid
}: Props) => {
  const {
    data: {
      local,
      communityChannels,
      communities,
      currentCommunity,
      currentCommunityId,
      oneTouchSendOpen,
      currentCommunityChannel,
      defaultCommunityId
    },
    isLoading
  } = chat;

  const classes = useStyles();

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCommunityChannels = async (communities) => {
    if (!communities?.length) {
      return [];
    }

    try {
      const promises = communities.map(async (course) => {
        if (course?.community) {
          const { community_channels: communityChannels } = await getCommunityChannels({
            communityId: course.community.id
          });
          return communityChannels;
        }
      });
      const channels = await Promise.all(promises);
      return channels
        .filter((channel: any) => channel.length > 0)
        .map((channel) => ({
          courseId: channel[0].community_id,
          channels: channel
        }));
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    async function fetchCommuniteis() {
      try {
        setLoading(true);
        const { communities } = await getCommunities();
        const communityChannels = await fetchCommunityChannels(communities);
        const nonEmptyCommunityIds = communityChannels
          .filter((channelGroup) => (channelGroup.channels as any).length > 0)
          .map((channelGroup) => channelGroup.courseId);
        const nonEmptyCommunities = communities.filter((community) =>
          nonEmptyCommunityIds.includes(community.community.id)
        );
        setCommunityList(nonEmptyCommunities);
        setCommunityChannels(communityChannels);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchCommuniteis();
  }, []);

  useEffect(() => {
    let defaultCommunity;

    if (communities.length === 0 || oneTouchSendOpen) {
      defaultCommunity = DEFAULT_COMMUNITY_MENU_ITEMS;
    } else if (!currentCommunityId) {
      defaultCommunity = (
        communities.find((community) => community.community.id === defaultCommunityId) ||
        communities[0]
      ).community;
    } else if (!currentCommunity) {
      defaultCommunity = (
        communities.find((community) => community.community.id === currentCommunityId) ||
        communities[0]
      ).community;
    }

    if (defaultCommunity) {
      setCurrentCommunityId(defaultCommunity.id);
      setCurrentCommunity(defaultCommunity);
    }
  }, [communities, oneTouchSendOpen, currentCommunity, currentCommunityId, defaultCommunityId]);

  useEffect(() => {
    if (!isLoading && !!Object.keys(local).length) {
      let count = 0;
      const channelList = Object.keys(local)
        .filter((l) => local[l].sid)
        .sort((a, b) => {
          if (local[a].lastMessage.message === '') {
            return 0;
          }

          return (
            moment(local[b].lastMessage.date).valueOf() -
            moment(local[a].lastMessage.date).valueOf()
          );
        });
      channelList.forEach((key) => {
        if (local[key]?.unread) {
          count += local[key].unread;
        }
      });
      setUnreadMessageCount(count);
    }
  }, [local, isLoading]);
  const handleSelect = useCallback(
    (course) => {
      if (course.id !== currentCommunity?.id) {
        setCurrentCommunityId(course.id);
        setCurrentChannelSid('');
        setCurrentCommunity(course);
      }
    },
    [currentCommunity, setCurrentCommunityId, setCurrentCommunity, setCurrentChannelSid]
  );

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className={classes.root}>
      <Box className={classes.collageList}>
        <CollageList
          local={local}
          unreadMessageCount={unreadMessageCount}
          selectedCourse={currentCommunity}
          communities={communities}
          communityChannels={communityChannels}
          handleSelect={handleSelect}
        />
      </Box>
      <Box className={classes.directChat}>
        {currentCommunity && currentCommunity.id === 'chat' ? <DirectChat /> : <CommunityChat />}
      </Box>
    </div>
  );
};

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      setCurrentCommunityId: chatActions.setCurrentCommunityId,
      setCommunityList: chatActions.setCommunityList,
      setCommunityChannels: chatActions.setCommunityChannels,
      setCurrentCommunity: chatActions.setCurrentCommunity,
      setCurrentChannelSid: chatActions.setCurrentChannelSid
    },
    dispatch
  );

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(ChatPage);
