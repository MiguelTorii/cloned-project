/* eslint-disable no-nested-ternary */
import { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import withWidth from '@material-ui/core/withWidth';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import { useSelectChannelById } from 'features/chat';
import {
  selectCurrentCommunity,
  selectCurrentCommunityChannel,
  selectCurrentCommunityChannels
} from 'reducers/chat';
import { useAppSelector } from 'redux/store';

import useStyles from './_styles/styles';
import CourseChannels from './CourseChannels';
import Main from './Main';
import RightMenu from './RightMenu';

import useIconClasses from 'components/_styles/Icons';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
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
