/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import useIconClasses from 'components/_styles/Icons';

import Main from './Main';
import RightMenu from './RightMenu';
import CourseChannels from './CourseChannels';
import useStyles from './_styles/styles';
import { CommunityChannels, CommunityChannelData, CommunityChannelsData } from 'reducers/chat';
import { setCurrentChannelSidAction, setCurrentCommunityChannel } from 'actions/chat';
import { Dispatch } from 'types/store';
import { useAppSelector } from 'redux/store';
import { useChannels, useSelectChannelById } from 'features/chat';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
};

// TODO: Refactor width, open and close logic to reusable sidebar component
const CommunityChat = ({ width }: Props) => {
  const classes = useStyles();
  const dispatch: Dispatch = useDispatch();

  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(['xs'].includes(width) ? 0 : 3);
  const [prevWidth, setPrevWidth] = useState(null);
  const [communityChannels, setCommunityChannels] = useState<CommunityChannelsData[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<CommunityChannelData>();
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string;
    lastIndex: number;
  }>({
    channelId: null,
    lastIndex: null
  });

  const iconClasses = useIconClasses();

  const {
    isLoading,
    data: {
      currentCommunity,
      communityChannels: allCommunityChannels,
      currentCommunityChannelId,
      selectedChannelId
    }
  } = useAppSelector((state) => state.chat);

  const { data: localChannels } = useChannels();
  const { data: currentCommunityChannel } = useSelectChannelById(currentCommunityChannelId);

  useEffect(() => {
    const currentCommunityChannels: CommunityChannelData[] = [];
    const filterCurrentCommunityChannel: CommunityChannels[] = allCommunityChannels.filter(
      (communityChannel) => communityChannel.courseId === currentCommunity?.id
    );

    if (currentCommunity?.id !== 0 && filterCurrentCommunityChannel[0]) {
      const { channels } = filterCurrentCommunityChannel[0];
      channels.forEach((communityChannel) => {
        const { channels } = communityChannel;
        currentCommunityChannels.push(...channels);
      });
      setCommunityChannels(channels);

      const defaultChannel = localChannels?.find(
        (c) => c.sid === currentCommunityChannels[0]?.chat_id
      );

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
          setCurrentCommunityChannel(defaultChannel)(dispatch);
        }
      } else {
        // currentCommunityChannel is not exists, set the default first channel
        // TODO Fix integration with react query
        setSelectedChannel(currentCommunityChannels[0]);
        setCurrentCommunityChannel(defaultChannel)(dispatch);
        dispatch(setCurrentChannelSidAction(currentCommunityChannels[0]?.chat_id));
      }
    }
  }, [allCommunityChannels, currentCommunity, currentCommunityChannel, dispatch, localChannels]);

  useEffect(() => {
    const targetSelectedChannel = selectedChannel ? localChannels?.[selectedChannel.chat_id] : null;

    if (targetSelectedChannel) {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }
    }
  }, [selectedChannel, width, isLoading, localChannels]);

  // This effect is to keep the index of last read message.
  useEffect(() => {
    // We just want to update the last read message info only if the channel is changed.
    if (selectedChannel?.chat_id === lastReadMessageInfo.channelId) {
      return;
    }

    const localChannel = localChannels?.find((c) => c.sid === selectedChannel?.chat_id);
    if (!localChannel) {
      return;
    }

    // Use `any` type because `Property 'channelState' is private and only accessible within class 'Channel'.`
    setLastReadMessageInfo({
      channelId: selectedChannel?.chat_id,
      lastIndex: localChannel.lastConsumedMessageIndex
    });
  }, [selectedChannel, lastReadMessageInfo, localChannels]);

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

  return (
    <Grid className={classes.container} direction="row" container>
      <IconButton
        className={cx(
          classes.expandButton,
          leftSpace !== 0 ? classes.sidebarButton : classes.bodyButton
        )}
        onClick={onCollapseLeft}
      >
        {/* TODO: Refactor to single reusable expand icon in sidebar component */}
        {leftSpace === 0 ? (
          <MenuOpenIcon style={{ transform: 'rotate(180deg)' }} />
        ) : (
          <SvgIcon
            className={cx(iconClasses.collapseIconLeft)}
            component={CollapseIcon}
            viewBox="0 0 32 32"
          />
        )}
      </IconButton>
      {leftSpace !== 0 && (
        <Grid
          item
          xs={(leftSpace || 1) as any}
          className={leftSpace !== 0 ? classes.left : classes.hidden}
        >
          {isLoading || !currentCommunity ? (
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
              communityChannels={communityChannels}
              currentCommunity={currentCommunity}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
            />
          )}
        </Grid>
      )}
      {!isLoading && leftSpace !== 12 && (
        <Grid item xs={(12 - leftSpace - rightSpace) as any} className={classes.main}>
          <Main
            channel={currentCommunityChannel}
            channelLength={communityChannels.length}
            isCommunityChat
            lastReadMessageIndex={
              lastReadMessageInfo.channelId === selectedChannelId
                ? lastReadMessageInfo.lastIndex
                : null
            }
            rightSpace={rightSpace}
            selectedChannel={selectedChannel}
            setRightPanel={handleOpenRightPanel}
          />
        </Grid>
      )}
      {!isLoading && currentCommunityChannel && (
        <Grid
          item
          xs={(rightSpace || 1) as any}
          className={rightSpace !== 0 ? classes.right : classes.hidden}
        >
          <RightMenu isCommunityChat channelId={currentCommunityChannel.sid} />
        </Grid>
      )}
    </Grid>
  );
};

export default withWidth()(CommunityChat);
