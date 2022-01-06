/* eslint-disable no-nested-ternary */
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
import * as chatActions from '../../actions/chat';
import * as notificationsActions from '../../actions/notifications';
import Main from './Main';
import RightMenu from './RightMenu';
import type { State as StoreState } from '../../types/state';
import CourseChannels from './CourseChannels';
import useStyles from './_styles/styles';
import { CommunityChannels, CommunityChannelData } from '../../reducers/chat';

const RIGHT_GRID_SPAN = 2;

type Props = {
  chat?: Record<string, any>;
  user?: Record<string, any>;
  setCurrentCommunityChannel?: (...args: Array<any>) => any;
  startMessageLoading?: (...args: Array<any>) => any;
  setMainMessage?: (...args: Array<any>) => any;
  showNotification?: (...args: Array<any>) => any;
  setCurrentChannelSidAction?: (...args: Array<any>) => any;
  width?: string;
};

const CommunityChat = ({
  setMainMessage,
  startMessageLoading,
  setCurrentCommunityChannel,
  setCurrentChannelSidAction,
  showNotification,
  user,
  chat,
  width
}: Props) => {
  const classes: any = useStyles();
  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(['xs'].includes(width) ? 0 : 3);
  const [prevWidth, setPrevWidth] = useState(null);
  const [communityChannels, setCommunityChannels] = useState([]);
  const [selectedChannel, setSelctedChannel] = useState(null);
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string;
    lastIndex: number;
  }>({
    channelId: null,
    lastIndex: null
  });
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
      communityChannels: allCommunityChannels,
      currentCommunityChannel,
      messageLoading,
      selectedChannelId
    }
  } = chat;
  useEffect(() => {
    const currentCommunityChannels: CommunityChannelData[] = [];
    const filterCurrentCommunityChannel: CommunityChannels[] = allCommunityChannels.filter(
      (communityChannel) => communityChannel.courseId === currentCommunity.id
    );

    if (currentCommunity.id !== 'chat' && filterCurrentCommunityChannel[0]) {
      const { channels } = filterCurrentCommunityChannel[0];
      channels.forEach((communityChannel) => {
        const { channels } = communityChannel;
        currentCommunityChannels.push(...channels);
      });
      setCommunityChannels(channels);

      if (currentCommunityChannel) {
        // currentCommunityChannel is exists, need to find the channel and select channel
        const filterChannel = currentCommunityChannels.filter(
          (channel) => channel.chat_id === currentCommunityChannel.sid
        );

        if (filterChannel.length) {
          // set select channel
          setSelctedChannel(filterChannel[0]);
          setCurrentChannelSidAction(filterChannel[0]?.chat_id);
        } else {
          // currentCommunityChannel is not in course channels, set the default first channel
          setSelctedChannel(currentCommunityChannels[0]);
          setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id);
          setCurrentCommunityChannel(local?.[currentCommunityChannels[0]?.chat_id]?.twilioChannel);
        }
      } else {
        // currentCommunityChannel is not exists, set the default first channel
        setSelctedChannel(currentCommunityChannels[0]);
        setCurrentCommunityChannel(local?.[currentCommunityChannels[0]?.chat_id]?.twilioChannel);
        setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id);
      }
    }
  }, [allCommunityChannels, currentCommunity, currentCommunityChannel, local]);
  useEffect(() => {
    const targetSelectedChannel = selectedChannel ? local[selectedChannel.chat_id] : null;

    if (targetSelectedChannel) {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel, width, isLoading]);

  // This effect is to keep the index of last read message.
  useEffect(() => {
    // We just want to update the last read message info only if the channel is changed.
    if (selectedChannel?.chat_id === lastReadMessageInfo.channelId) {
      return;
    }

    const localChannel = selectedChannel ? local[selectedChannel.chat_id] : null;
    if (!localChannel) {
      return;
    }

    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    setLastReadMessageInfo({
      channelId: selectedChannel.chat_id,
      lastIndex: localChannel.twilioChannel.channelState.lastConsumedMessageIndex
    });
  }, [selectedChannel, lastReadMessageInfo, local]);

  const curSize = useMemo(
    () => (width === 'xs' ? 12 : ['md', 'sm'].includes(width) ? 4 : 2),
    [width]
  );
  const handleOpenRightPanel = useCallback(() => {
    if (['xs', 'sm'].includes(width)) {
      setRightSpace(0);
    } else if (!rightSpace) {
      setRightSpace(RIGHT_GRID_SPAN);
    } else {
      setRightSpace(0);
    }
  }, [rightSpace, width]);
  useEffect(() => {
    if (width !== prevWidth) {
      if (['xs', 'sm', 'md'].includes(width)) {
        setRightSpace(0);

        if (currentCommunityChannel) {
          setLeftSpace(0);
        } else {
          setLeftSpace(curSize);
        }
      } else {
        setLeftSpace(curSize);
      }
    }

    if (currentCommunityChannel && !isLoading && !['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(RIGHT_GRID_SPAN);
    }

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
          xs={(leftSpace || 1) as any}
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
              currentCommunity={currentCommunity}
              currentCommunityChannel={currentCommunityChannel}
              setCurrentChannelSidAction={setCurrentChannelSidAction}
              setCurrentCommunityChannel={setCurrentCommunityChannel}
            />
          )}
        </Grid>
      )}
      {!isLoading && leftSpace !== 12 && (
        <Grid item xs={(12 - leftSpace - rightSpace) as any} className={classes.main}>
          <Main
            isCommunityChat
            lastReadMessageIndex={
              lastReadMessageInfo.channelId === selectedChannelId
                ? lastReadMessageInfo.lastIndex
                : null
            }
            channelList={communityChannels}
            currentCommunity={currentCommunity}
            selectedChannel={selectedChannel}
            newMessage={newMessage}
            messageLoading={messageLoading}
            startMessageLoading={startMessageLoading}
            setMainMessage={setMainMessage}
            mainMessage={mainMessage}
            permission={permission}
            local={local}
            channel={currentCommunityChannel}
            selectedChannelId={selectedChannelId}
            onCollapseLeft={onCollapseLeft}
            onCollapseRight={onCollapseRight}
            setRightPanel={handleOpenRightPanel}
            user={user}
            rightSpace={rightSpace}
            showNotification={showNotification}
          />
        </Grid>
      )}
      {!isLoading && (
        <Grid
          item
          xs={(rightSpace || 1) as any}
          className={rightSpace !== 0 ? classes.right : classes.hidden}
        >
          <RightMenu
            isCommunityChat
            userId={userId}
            schoolId={schoolId}
            channel={currentCommunityChannel}
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

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      showNotification: notificationsActions.showNotification,
      setMainMessage: chatActions.setMainMessage,
      setCurrentCommunityChannel: chatActions.setCurrentCommunityChannel,
      startMessageLoading: chatActions.startMessageLoading,
      setCurrentChannelSidAction: chatActions.setCurrentChannelSid
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(CommunityChat));
