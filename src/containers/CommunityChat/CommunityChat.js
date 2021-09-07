/* eslint-disable no-nested-ternary */
// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import * as chatActions from 'actions/chat';
import * as notificationsActions from 'actions/notifications';
import Main from 'containers/CommunityChat/Main';
import RightMenu from 'containers/CommunityChat/RightMenu';
import type { State as StoreState } from '../../types/state';
import CourseChannels from './CourseChannels';
import useStyles from './_styles/styles';

type Props = {
  chat: Object,
  user: Object,
  setCurrentCommunityChannel: Function,
  startMessageLoading: Function,
  setMainMessage: Function,
  setSelectedCourse: Function,
  enqueueSnackbar: Function,
  setCurrentChannelSidAction: Function,
  courseChannels: array,
  width: string
};

const CommunityChat = ({
  selectedCourse,
  setMainMessage,
  startMessageLoading,
  setCurrentCommunityChannel,
  setSelectedCourse,
  setCurrentChannelSidAction,
  enqueueSnackbar,
  courseChannels,
  user,
  chat,
  width
}: Props) => {
  const classes = useStyles();
  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(['xs'].includes(width) ? 0 : 3);
  const [prevWidth, setPrevWidth] = useState(null);
  const [communityChannels, setCommunityChannels] = useState([]);
  const [currentCommunityChannels, setCurrentCommunityChannels] = useState([]);

  const [selectedChannel, setSelctedChannel] = useState(null);

  const {
    data: { userId, schoolId, permission }
  } = user;
  const {
    isLoading,
    data: {
      newMessage,
      local,
      mainMessage,
      currentCommunity,
      currentCommunityChannel,
      messageLoading
    }
  } = chat;

  useEffect(() => {
    let filterChannel = [];
    const currentCommunityChannels = [];
    const currentCourseChannel = courseChannels.filter(
      (courseChannel) => courseChannel.courseId === selectedCourse.id
    );
    const communityChannels = currentCourseChannel[0]?.channels;
    setCommunityChannels(communityChannels);
    communityChannels.forEach((communityChannel) => {
      const { channels } = communityChannel;
      currentCommunityChannels.push(...channels);
      filterChannel = channels.filter(
        (channel) => channel.id === currentCommunity.id
      );
    });
    setCurrentCommunityChannels(currentCommunityChannels);
    if (
      (currentCommunity && !!filterChannel.length) ||
      currentCommunityChannel
    ) {
      setSelctedChannel(currentCommunity);
    } else {
      setSelctedChannel(communityChannels[0].channels[0]);
    }
  }, [
    selectedCourse,
    courseChannels,
    currentCommunity,
    currentCommunityChannel,
    setCurrentCommunityChannels
  ]);

  useEffect(() => {
    if (currentCommunityChannel) {
      // currentCommunityChannel is exists, need to find the channel and select channel
      const filterChannel = currentCommunityChannels.filter(
        (channel) => channel.chat_id === currentCommunityChannel.sid
      );
      if (filterChannel.length) {
        // set select channel
        setSelctedChannel(filterChannel[0]);
      } else {
        // currentCommunityChannel is not in course channels, set the default first channel
        setSelctedChannel(currentCommunityChannels[0]);
      }
    } else {
      // currentCommunityChannel is not exists, set the default first channel
      setSelctedChannel(currentCommunityChannels[0]);
      setCurrentCommunityChannel(
        local?.[currentCommunityChannels[0]?.chat_id]?.twilioChannel
      );
      setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id);
    }
  }, [currentCommunityChannels, currentCommunityChannel, local]);

  useEffect(() => {
    const targetSelectedChannel = selectedChannel
      ? local[selectedChannel.chat_id]
      : null;

    if (targetSelectedChannel) {
      if (['xs'].includes(width)) setLeftSpace(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel, width, isLoading]);

  const curSize = useMemo(
    () => (width === 'xs' ? 12 : ['md', 'sm'].includes(width) ? 4 : 2),
    [width]
  );

  const handleOpenRightPanel = useCallback(() => {
    if (['xs', 'sm'].includes(width)) {
      setRightSpace(0);
    } else if (!rightSpace) setRightSpace(3);
    else setRightSpace(0);
  }, [rightSpace, width]);

  useEffect(() => {
    if (width !== prevWidth) {
      if (['xs', 'sm', 'md'].includes(width)) {
        setRightSpace(0);
        if (currentCommunityChannel) setLeftSpace(0);
        else setLeftSpace(curSize);
      } else {
        setLeftSpace(curSize);
      }
    }

    if (
      currentCommunityChannel &&
      !isLoading &&
      !['xs', 'sm', 'md'].includes(width)
    )
      setRightSpace(3);

    setPrevWidth(width);
  }, [prevWidth, width, curSize, currentCommunityChannel, isLoading]);

  const onCollapseLeft = useCallback(() => {
    if (['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(0);
    }
    setLeftSpace(leftSpace ? 0 : curSize);
  }, [width, curSize, leftSpace]);

  const onCollapseRight = useCallback(() => {
    if (width === 'xs') {
      setLeftSpace(0);
    }
    setRightSpace(rightSpace ? 0 : curSize);
  }, [width, curSize, rightSpace]);

  const renderIcon = useCallback((d) => (d ? <IconLeft /> : <IconRight />), []);

  return (
    <Grid className={classes.container} direction="row" container>
      <IconButton
        className={cx(
          classes.expandButton,
          leftSpace !== 0 ? classes.sidebarButton : classes.bodyButton
        )}
        onClick={onCollapseLeft}
      >
        {renderIcon(leftSpace !== 0)}
      </IconButton>
      {leftSpace !== 0 && (
        <Grid
          item
          xs={leftSpace || 1}
          className={leftSpace !== 0 ? classes.left : classes.hidden}
        >
          {isLoading ? (
            <Box
              className={classes.loading}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress />
            </Box>
          ) : (
            <CourseChannels
              setSelctedChannel={setSelctedChannel}
              selectedChannel={selectedChannel}
              startMessageLoading={startMessageLoading}
              communityChannels={communityChannels}
              local={local}
              course={selectedCourse}
              setCurrentChannelSidAction={setCurrentChannelSidAction}
              setCurrentCommunityChannel={setCurrentCommunityChannel}
            />
          )}
        </Grid>
      )}
      {!isLoading && leftSpace !== 12 && (
        <Grid item xs={12 - leftSpace - rightSpace} className={classes.main}>
          <Main
            isCommunityChat
            channelList={communityChannels}
            selectedCourse={selectedCourse}
            selectedChannel={selectedChannel}
            newMessage={newMessage}
            messageLoading={messageLoading}
            startMessageLoading={startMessageLoading}
            setMainMessage={setMainMessage}
            mainMessage={mainMessage}
            permission={permission}
            local={local}
            channel={currentCommunityChannel}
            onCollapseLeft={onCollapseLeft}
            onCollapseRight={onCollapseRight}
            setRightPanel={handleOpenRightPanel}
            user={user}
            rightSpace={rightSpace}
            enqueueSnackbar={enqueueSnackbar}
          />
        </Grid>
      )}
      {!isLoading && (
        <Grid
          item
          xs={rightSpace || 1}
          className={rightSpace !== 0 ? classes.right : classes.hidden}
        >
          <RightMenu
            isCommunityChat
            userId={userId}
            schoolId={schoolId}
            channel={currentCommunityChannel}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            local={local}
          />
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
      setMainMessage: chatActions.setMainMessage,
      setCurrentCommunityChannel: chatActions.setCurrentCommunityChannel,
      startMessageLoading: chatActions.startMessageLoading,
      setCurrentChannelSidAction: chatActions.setCurrentChannelSid
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(CommunityChat));
