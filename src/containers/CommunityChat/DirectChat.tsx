/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { useParams } from 'react-router';

import type { GridSize } from '@material-ui/core/Grid';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import withWidth from '@material-ui/core/withWidth';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import { handleNewChannel, navigateToDM, updateFriendlyName } from 'actions/chat';
import { getOnboardingList } from 'actions/onboarding';
import { blockChatUser, leaveChat } from 'api/chat';
import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import { useSelectChannelById, useOrderedChannelList } from 'features/chat';
import { useAppDispatch, useAppSelector } from 'redux/store';

import blockUser from './_styles/blockUser';
import useStyles from './_styles/directChat';
import LeftMenu from './LeftMenu';
import Main from './Main';
import RightMenu from './RightMenu';

import useIconClasses from 'components/_styles/Icons';

import type { Channel } from 'twilio-chat';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
};

type NumberGridSizes = Exclude<GridSize, 'auto'> | 0;

// TODO Refactor width, open and close logic to reusable sidebar component
const DirectChat = ({ width }: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const {
    isLoading,
    data: { selectedChannelId, newChannel, openChannels }
  } = useAppSelector((state) => state.chat);

  const { chatId } = useParams();

  const {
    data: { userId }
  } = useAppSelector((state) => state.user);

  const onboardingListVisible = useAppSelector((state) => state.onboarding.onboardingList.visible);

  const channelListLength = useOrderedChannelList().length;

  const { data: currentChannel } = useSelectChannelById(chatId);

  const [leftSpace, setLeftSpace] = useState<NumberGridSizes>(2);
  const [rightSpace, setRightSpace] = useState<NumberGridSizes>(0);
  const [prevWidth, setPrevWidth] = useState(null);
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string | null;
    lastIndex: Channel['lastConsumedMessageIndex'];
  }>({
    channelId: null,
    lastIndex: null
  });
  const iconClasses = useIconClasses();

  const onNewChannel = useCallback(() => {
    dispatch(handleNewChannel(true));
  }, [dispatch]);

  const handleOpenRightPanel = useCallback(() => {
    if (['xs'].includes(width)) {
      setRightSpace(0);
    } else if (!rightSpace) {
      setRightSpace(RIGHT_GRID_SPAN);
    } else {
      setRightSpace(0);
    }
  }, [rightSpace, width]);

  const onOpenChannel = useCallback(
    (sid: string) => {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }

      dispatch(navigateToDM(sid));
    },
    [dispatch, width]
  );

  const handleRemove = useCallback(async (sid) => {
    try {
      await leaveChat(sid);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateGroupName = useCallback(
    (channel: Channel) => {
      dispatch(navigateToDM(channel.sid));
      dispatch(updateFriendlyName(channel));
    },
    [dispatch]
  );

  const curSize = useMemo(
    () => (width === 'xs' ? 12 : ['md', 'sm'].includes(width) ? 4 : 3),
    [width]
  );

  useEffect(() => {
    if (width !== prevWidth) {
      if (['xs', 'sm', 'md'].includes(width)) {
        setRightSpace(0);

        if (currentChannel) {
          setLeftSpace(0);
        } else {
          setLeftSpace(curSize);
        }
      } else {
        setLeftSpace(curSize);
      }
    }

    if (currentChannel && !isLoading && !['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(RIGHT_GRID_SPAN);
    }

    setPrevWidth(width);
  }, [prevWidth, width, curSize, currentChannel, isLoading]);

  // This effect is to keep the index of last read message.
  useEffect(() => {
    if (!currentChannel) {
      return;
    }

    const sid = currentChannel.sid;

    // We just want to update the last read message info only if the channel is changed.
    if (sid === lastReadMessageInfo.channelId) {
      return;
    }

    if (sid) {
      setLastReadMessageInfo({
        lastIndex: currentChannel.lastConsumedMessageIndex,
        channelId: currentChannel.sid
      });
    }
    // Use `any` type here because `Property 'channelState' is private and only accessible within class 'Channel'.`
  }, [currentChannel, lastReadMessageInfo]);

  const handleBlock = useCallback(
    async (blockedUserId) => {
      try {
        await blockUser({
          userId,
          blockedUserId: blockedUserId
        });
        await blockChatUser(blockedUserId);
        dispatch(navigateToDM(''));
      } catch (err) {
        /* NONE */
      }
    },
    [dispatch, userId]
  );
  const onCollapseLeft = useCallback(() => {
    if (['xs', 'sm', 'md'].includes(width)) {
      setRightSpace(0);
    }

    setLeftSpace(leftSpace ? 0 : curSize);
  }, [width, curSize, leftSpace]);

  const onCollapseRight = useCallback(() => {
    if (['xs'].includes(width)) {
      setLeftSpace(0);
    }

    setRightSpace(rightSpace ? 0 : curSize);
  }, [width, curSize, rightSpace]);

  return (
    <Grid
      className={cx(leftSpace !== 0 ? classes.container : classes.directContainer)}
      direction="row"
      container
    >
      {/* TODO Refactor to single reusable expand icon in sidebar component */}
      <IconButton
        className={cx(
          classes.expandButton,
          leftSpace !== 0 ? classes.sidebarButton : classes.bodyButton
        )}
        onClick={onCollapseLeft}
      >
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
        <Grid item xs={leftSpace || 1} className={leftSpace !== 0 ? classes.left : classes.hidden}>
          <LeftMenu
            onNewChannel={onNewChannel}
            onOpenChannel={onOpenChannel}
            handleUpdateGroupName={updateGroupName}
            handleRemoveChannel={handleRemove}
          />
        </Grid>
      )}
      {leftSpace !== 12 && (
        <Grid item xs={12 - leftSpace - rightSpace} className={classes.main}>
          <Main
            channelLength={channelListLength}
            channel={currentChannel}
            handleBlock={handleBlock}
            handleUpdateGroupName={updateGroupName}
            lastReadMessageIndex={
              lastReadMessageInfo.channelId === currentChannel?.sid
                ? lastReadMessageInfo.lastIndex
                : null
            }
            onSend={() => {
              if (onboardingListVisible) {
                setTimeout(() => getOnboardingList()(dispatch), 1000);
              }
            }}
            rightSpace={rightSpace}
            setRightPanel={handleOpenRightPanel}
          />
        </Grid>
      )}
      <Grid item xs={rightSpace || 1} className={rightSpace !== 0 ? classes.right : classes.hidden}>
        <RightMenu channelId={chatId} />
      </Grid>
    </Grid>
  );
};

export default withWidth()(DirectChat);
