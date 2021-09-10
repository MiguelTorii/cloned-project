// @flow
import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import Box from '@material-ui/core/Box';
import { getCommunities, getCommunityChannels } from 'api/community';
import * as chatActions from 'actions/chat';
import LoadingSpin from 'components/LoadingSpin';
import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import DEFAULT_COMMUNITY_MENU_ITEMS from './constants';
import useStyles from './_styles/styles';
import type { State as StoreState } from '../../types/state';

const ChatPage = ({
  chat,
  setCurrentCourse,
  setCommunityList,
  setCommunityChannels,
  selectCurrentCommunity,
  setCurrentChannelSid
}) => {
  const {
    data: {
      local,
      currentCommunity,
      currentCourseId,
      oneTouchSendOpen,
      currentCommunityChannel
    },
    isLoading
  } = chat;

  const classes = useStyles();

  const campaign = useSelector((state) => state.campaign);

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [courseChannels, setCourseChannels] = useState([]);
  const [communityList, setCommunities] = useState([]);

  const fetchCommunityChannels = async (communities) => {
    if (!communities?.length) return [];

    try {
      const promises = communities.map(async (course) => {
        if (course?.community) {
          const { community_channels: communityChannels } =
            await getCommunityChannels({ communityId: course.community.id });
          return communityChannels;
        }
      });

      const channels = await Promise.all(promises);
      return channels
        .filter((channel) => channel.length > 0)
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
          .filter((channelGroup) => channelGroup.channels.length > 0)
          .map((channelGroup) => channelGroup.courseId);

        const nonEmptyCommunities = communities.filter((community) =>
          nonEmptyCommunityIds.includes(community.community.id)
        );

        setCommunityList(nonEmptyCommunities);
        setCommunities(nonEmptyCommunities);

        setCourseChannels(communityChannels);
        setCommunityChannels(communityChannels);

        if (!currentCommunityChannel && nonEmptyCommunities.length > 0) {
          const defaultCommunity = nonEmptyCommunities[0].community;
          setCurrentCourse(defaultCommunity.id);
          setSelectedCourse(defaultCommunity);
          selectCurrentCommunity(defaultCommunity);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchCommuniteis();
  }, []);

  useEffect(() => {
    if (!isLoading && !!Object.keys(local).length) {
      let count = 0;
      const channelList = Object.keys(local)
        .filter((l) => local[l].sid)
        .sort((a, b) => {
          if (local[a].lastMessage.message === '') return 0;
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
      if (course.id !== selectedCourse?.id) {
        setCurrentCourse(course.id);
        setSelectedCourse(course);
        setCurrentChannelSid('');
        selectCurrentCommunity(course);
      }
    },
    [
      selectedCourse,
      setCurrentCourse,
      selectCurrentCommunity,
      setCurrentChannelSid
    ]
  );

  useEffect(() => {
    if (oneTouchSendOpen) {
      setSelectedCourse(DEFAULT_COMMUNITY_MENU_ITEMS);
    } else if (currentCourseId === 'chat' || !currentCourseId) {
      setSelectedCourse(DEFAULT_COMMUNITY_MENU_ITEMS);
    } else if (
      currentCommunity &&
      !!communityList.length &&
      currentCommunity.id !== 'chat'
    ) {
      const targetCourse = communityList.filter(
        (course) => course.community.id === currentCommunity.id
      );
      if (targetCourse.length) setSelectedCourse(targetCourse[0]?.community);
    } else if (
      currentCourseId &&
      !!communityList.length &&
      currentCourseId !== 'chat'
    ) {
      const targetCourseChannel = communityList.filter(
        (community) => community.community.id === Number(currentCourseId)
      );
      if (targetCourseChannel.length)
        setSelectedCourse(targetCourseChannel[0].community);
    }
  }, [
    currentCourseId,
    setCurrentCourse,
    selectCurrentCommunity,
    currentCommunity,
    communityList,
    loading,
    campaign.chatLanding
  ]);

  if (loading) return <LoadingSpin />;

  return (
    <div className={classes.root}>
      <Box className={classes.collageList} direction="row">
        <CollageList
          local={local}
          unreadMessageCount={unreadMessageCount}
          selectedCourse={selectedCourse}
          communities={communityList}
          courseChannels={courseChannels}
          handleSelect={handleSelect}
        />
      </Box>
      <Box className={classes.directChat}>
        {selectedCourse && selectedCourse.id === 'chat' ? (
          <DirectChat />
        ) : (
          <CommunityChat
            isLoading={isLoading}
            selectedCourse={selectedCourse}
            courseChannels={courseChannels}
            setSelectedCourse={setSelectedCourse}
          />
        )}
      </Box>
    </div>
  );
};

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      setCurrentCourse: chatActions.setCurrentCourse,
      setCommunityList: chatActions.setCommunityList,
      setCommunityChannels: chatActions.setCommunityChannels,
      selectCurrentCommunity: chatActions.selectCurrentCommunity,
      setCurrentChannelSid: chatActions.setCurrentChannelSid
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
