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
    data: { local, currentCommunity, currentCourseId, oneTouchSendOpen },
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
    try {
      const promises = communities.map(async (course) => {
        if (course?.community) {
          const { community_channels: communityChannels } =
            await getCommunityChannels({ communityId: course.community.id });
          return communityChannels;
        }
      });

      const channels = await Promise.all(promises);
      const communityChannels = channels.map((channel) => {
        if (channel.length) {
          return {
            courseId: channel[0].community_id,
            channels: channel
          };
        }
        return {
          courseId: channel[0].community_id,
          channels: []
        };
      });
      setCourseChannels(communityChannels);
      setCommunityChannels(communityChannels);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCommuniteis() {
      try {
        setLoading(true);
        const { communities } = await getCommunities();
        if (communities.length) await fetchCommunityChannels(communities);
        setCommunityList(communities);
        setCommunities(communities);
        if (communities.length > 0) {
          const defaultCommunity = communities[0].community;
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
    } else if (
      currentCommunity &&
      !!communityList.length &&
      currentCourseId &&
      currentCourseId !== 'chat'
    ) {
      const targetCourse = communityList.filter(
        (course) => course.community.id === currentCourseId
      );
      if (targetCourse.length) setSelectedCourse(targetCourse[0]?.community);
    } else {
      setSelectedCourse(DEFAULT_COMMUNITY_MENU_ITEMS);
    }
  }, [
    setCurrentCourse,
    selectCurrentCommunity,
    currentCourseId,
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
