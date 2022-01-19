/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import Main from './Main';
import RightMenu from './RightMenu';
import CourseChannels from './CourseChannels';
import useStyles from './_styles/styles';
import { CommunityChannels, CommunityChannelData, ChatState } from '../../reducers/chat';
import { UserState } from '../../reducers/user';
import { setCurrentChannelSidAction, setCurrentCommunityChannel } from '../../actions/chat';
import { Dispatch } from '../../types/store';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
};

const CommunityChat = ({ width }: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(['xs'].includes(width) ? 0 : 3);
  const [prevWidth, setPrevWidth] = useState(null);
  const [communityChannels, setCommunityChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string;
    lastIndex: number;
  }>({
    channelId: null,
    lastIndex: null
  });

  const {
    data: { userId, schoolId }
  } = useSelector((state: { user: UserState }) => state.user);

  const {
    isLoading,
    data: {
      local,
      currentCommunity,
      communityChannels: allCommunityChannels,
      currentCommunityChannel,
      selectedChannelId
    }
  } = useSelector((state: { chat: ChatState }) => state.chat);

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
          setSelectedChannel(filterChannel[0]);
          dispatch(setCurrentChannelSidAction(filterChannel[0]?.chat_id));
        } else {
          // currentCommunityChannel is not in course channels, set the default first channel
          setSelectedChannel(currentCommunityChannels[0]);
          dispatch(setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id));
          setCurrentCommunityChannel(local?.[currentCommunityChannels[0]?.chat_id]?.twilioChannel)(
            dispatch
          );
        }
      } else {
        // currentCommunityChannel is not exists, set the default first channel
        setSelectedChannel(currentCommunityChannels[0]);
        setCurrentCommunityChannel(local?.[currentCommunityChannels[0]?.chat_id]?.twilioChannel)(
          dispatch
        );
        dispatch(setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id));
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
      lastIndex: (localChannel.twilioChannel as any).channelState.lastConsumedMessageIndex
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
              setSelectedChannel={setSelectedChannel}
              selectedChannel={selectedChannel}
              communityChannels={communityChannels}
              local={local}
              currentCommunity={currentCommunity}
              currentCommunityChannel={currentCommunityChannel}
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
            channel={currentCommunityChannel}
            selectedChannelId={selectedChannelId}
            setRightPanel={handleOpenRightPanel}
            rightSpace={rightSpace}
          />
        </Grid>
      )}
      {!isLoading && (
        <Grid
          item
          xs={(rightSpace || 1) as any}
          className={rightSpace !== 0 ? classes.right : classes.hidden}
        >
          <RightMenu isCommunityChat channel={currentCommunityChannel} />
        </Grid>
      )}
    </Grid>
  );
};

export default withWidth()(CommunityChat);
