/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';

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
import {
  selectCurrentCommunity,
  selectCurrentCommunityChannel,
  selectCurrentCommunityChannels,
  selectCurrentCommunityId
} from 'reducers/chat';
import { setCurrentCommunityChannel, setCurrentCommunityId } from 'actions/chat';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useChannels, useSelectChannelById } from 'features/chat';
import { usePrevious } from 'hooks';
import { useParams } from 'react-router';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
};

/**
 * TODO Replace with approach that handle communities properly:
 * chat/communityId/channelid
 * chat/channelid
 */
const useCommunityNavigationHandling = () => {
  const dispatch = useAppDispatch();

  const {
    data: { currentCommunityChannelId }
  } = useAppSelector((state) => state.chat);

  const { data: channels } = useChannels();
  // TODO Clean up by changing naming convention and removing redundant state
  const currentCommunityId = useAppSelector(selectCurrentCommunityId);
  const previousCommunityId = usePrevious(currentCommunityId);
  const selectedChannel = useAppSelector(selectCurrentCommunityChannel);
  const allCurrentCommunityChannels = useAppSelector(selectCurrentCommunityChannels);

  const { chatId } = useParams();

  useEffect(() => {
    if (!channels?.length) return;

    const channelInCommunity = allCurrentCommunityChannels?.find(
      (c) => c.chat_id === currentCommunityChannelId
    );
    const channel = channels.find((c) => c.sid === chatId);
    if (
      /**
       * If user chooses a different community from a stored or previously selected one
       * the channel exists but doesn't match current community id
       * So we need to set aset different community
       */
      chatId &&
      currentCommunityChannelId &&
      currentCommunityChannelId !== chatId &&
      !allCurrentCommunityChannels?.some((c) => c.chat_id === chatId) &&
      channel &&
      channels?.attributes?.community_id
    ) {
      dispatch(setCurrentCommunityChannel(channel));
      dispatch(setCurrentCommunityId(Number(channel.attributes.community_id)));
    } else if (
      // Through normal navigation, if a community is selected but no channel is selected
      (currentCommunityId !== 0 && allCurrentCommunityChannels?.length && !selectedChannel) ||
      /**
       * When changing community, select first channel
       * Ideally we'd store what channel was selected in each community
       */
      (previousCommunityId && previousCommunityId !== currentCommunityId && !channelInCommunity)
    ) {
      const defaultChannel = channels?.find(
        (c) => c.sid === allCurrentCommunityChannels?.[0].chat_id
      );
      if (defaultChannel) {
        dispatch(setCurrentCommunityChannel(defaultChannel));
      }
    }
  }, [
    allCurrentCommunityChannels,
    channels,
    chatId,
    currentCommunityChannelId,
    currentCommunityId,
    dispatch,
    previousCommunityId,
    selectedChannel
  ]);
};

// TODO: Refactor width, open and close logic to reusable sidebar component
const CommunityChat = ({ width }: Props) => {
  const classes = useStyles();

  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(['xs'].includes(width) ? 0 : 3);
  const [prevWidth, setPrevWidth] = useState(null);
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
    data: { currentCommunityChannelId, selectedChannelId }
  } = useAppSelector((state) => state.chat);

  useCommunityNavigationHandling();

  const { data: currentCommunitySDKChannel } = useSelectChannelById(currentCommunityChannelId);

  const currentCommunity = useAppSelector(selectCurrentCommunity);
  const selectedChannel = useAppSelector(selectCurrentCommunityChannel);
  const allCurrentCommunityChannels = useAppSelector(selectCurrentCommunityChannels);

  useEffect(() => {
    if (currentCommunitySDKChannel) {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }
    }
  }, [currentCommunitySDKChannel, width]);

  // This effect is to keep the index of last read message.
  useEffect(() => {
    // We just want to update the last read message info only if the channel is changed.
    if (
      selectedChannel?.chat_id === lastReadMessageInfo.channelId ||
      !currentCommunitySDKChannel ||
      !selectedChannel
    ) {
      return;
    }

    setLastReadMessageInfo({
      channelId: selectedChannel?.chat_id,
      lastIndex: currentCommunitySDKChannel.lastConsumedMessageIndex
    });
  }, [selectedChannel, lastReadMessageInfo, currentCommunitySDKChannel]);

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

        if (currentCommunitySDKChannel) {
          setLeftSpace(0);
        } else {
          setLeftSpace(curSize);
        }
      } else {
        setLeftSpace(curSize);
      }
    }

    if (currentCommunitySDKChannel && !isLoading && !['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(RIGHT_GRID_SPAN);
    }

    setPrevWidth(width);
  }, [prevWidth, width, curSize, currentCommunitySDKChannel, isLoading]);

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
          {isLoading || !currentCommunity || !allCurrentCommunityChannels?.length ? (
            <Box
              className={classes.loading}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress />
            </Box>
          ) : (
            <CourseChannels currentCommunity={currentCommunity} selectedChannel={selectedChannel} />
          )}
        </Grid>
      )}
      {!isLoading && leftSpace !== 12 && (
        <Grid item xs={(12 - leftSpace - rightSpace) as any} className={classes.main}>
          <Main
            channel={currentCommunitySDKChannel}
            channelLength={allCurrentCommunityChannels?.length || 0}
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
      {!isLoading && currentCommunitySDKChannel && (
        <Grid
          item
          xs={(rightSpace || 1) as any}
          className={rightSpace !== 0 ? classes.right : classes.hidden}
        >
          <RightMenu isCommunityChat channelId={currentCommunitySDKChannel.sid} />
        </Grid>
      )}
    </Grid>
  );
};

export default withWidth()(CommunityChat);
