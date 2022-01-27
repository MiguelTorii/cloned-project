/* eslint-disable no-nested-ternary */
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import IconButton from '@material-ui/core/IconButton';
import IconLeft from '@material-ui/icons/ArrowBack';
import IconRight from '@material-ui/icons/ArrowForward';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as CollapseIcon } from 'assets/svg/collapse-icon.svg';
import useIconClasses from 'components/_styles/Icons';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import Main from './Main';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import useStyles from './_styles/directChat';
import {
  handleNewChannel,
  handleRemoveChannel,
  setCurrentChannel,
  setCurrentChannelSidAction,
  updateFriendlyName
} from '../../actions/chat';
import { OnboardingState } from '../../reducers/onboarding';
import { Dispatch } from '../../types/store';
import { blockChatUser } from '../../api/chat';
import { getOnboardingList } from '../../actions/onboarding';
import blockUser from './_styles/blockUser';

const RIGHT_GRID_SPAN = 2;

type Props = {
  width?: string;
};

// TODO Refactor width, open and close logic to reusable sidebar component
const DirectChat = ({ width }: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const {
    isLoading,
    data: { selectedChannelId, local, newChannel, currentChannel, openChannels }
  } = useSelector((state: { chat: ChatState }) => state.chat);

  const {
    data: { userId, schoolId }
  } = useSelector((state: { user: UserState }) => state.user);

  const onboardingListVisible = useSelector(
    (state: { onboarding: OnboardingState }) => state.onboarding.onboardingList.visible
  );

  const [leftSpace, setLeftSpace] = useState(2);
  const [rightSpace, setRightSpace] = useState(0);
  const [prevWidth, setPrevWidth] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [lastReadMessageInfo, setLastReadMessageInfo] = useState<{
    channelId: string;
    lastIndex: number;
  }>({
    channelId: null,
    lastIndex: null
  });
  const iconClasses = useIconClasses();

  const lastChannelSid = useMemo(() => localStorage.getItem('currentDMChannel'), []);
  const currentChannelId = useMemo(
    () => selectedChannelId || lastChannelSid || channelList[0],
    [selectedChannelId, lastChannelSid, channelList]
  );

  const onNewChannel = useCallback(() => {
    handleNewChannel(true, openChannels)(dispatch);
  }, [dispatch, openChannels]);

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
    ({ channel }) => {
      if (['xs'].includes(width)) {
        setLeftSpace(0);
      }

      if (newChannel) {
        handleNewChannel(false, openChannels)(dispatch);
      }

      dispatch(setCurrentChannelSidAction(channel.sid));
      setCurrentChannel(channel)(dispatch);
    },
    [dispatch, width, newChannel, openChannels]
  );

  const handleRemove = useCallback(
    async (sid) => {
      const restChannels = channelList.filter((channel) => channel !== sid.sid);

      if (currentChannel.sid === sid.sid) {
        dispatch(setCurrentChannelSidAction(restChannels[0]));
        await setCurrentChannel(
          local[restChannels[0]] ? local[restChannels[0]].twilioChannel : null
        )(dispatch);
      }

      handleRemoveChannel(sid)(dispatch);
    },
    [currentChannel, dispatch, channelList, local]
  );

  const updateGroupName = useCallback(
    (channel) => {
      setCurrentChannel(channel)(dispatch);
      dispatch(updateFriendlyName(channel));
    },
    [dispatch]
  );

  const curSize = useMemo(
    () => (width === 'xs' ? 12 : ['md', 'sm'].includes(width) ? 4 : 3),
    [width]
  );

  useEffect(() => {
    const channelList = Object.keys(local)
      .filter(
        (l) =>
          // Use `any` type here because `Property 'channelState' is private and only accessible within class 'Channel'.`
          local[l]?.sid && !(local[l]?.twilioChannel as any)?.channelState?.attributes?.community_id
      )
      .sort((a, b) => {
        if (local[a].lastMessage.message === '') {
          return 0;
        }

        return (
          moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
        );
      });
    setChannelList(channelList);
  }, [local]);
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
    // We just want to update the last read message info only if the channel is changed.
    if (currentChannel?.sid === lastReadMessageInfo.channelId) {
      return;
    }

    // Use `any` type here because `Property 'channelState' is private and only accessible within class 'Channel'.`
    setLastReadMessageInfo({
      lastIndex: (currentChannel as any)?.channelState.lastConsumedMessageIndex,
      channelId: currentChannel?.sid
    });
  }, [currentChannel, lastReadMessageInfo]);

  const handleBlock = useCallback(
    async (blockedUserId) => {
      try {
        await blockUser({
          userId,
          blockedUserId: blockedUserId
        });
        await blockChatUser(blockedUserId);
        setCurrentChannel(null)(dispatch);
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
        <Grid
          item
          xs={(leftSpace || 1) as any}
          className={leftSpace !== 0 ? classes.left : classes.hidden}
        >
          <LeftMenu
            channelList={channelList}
            lastChannelSid={lastChannelSid}
            onNewChannel={onNewChannel}
            onOpenChannel={onOpenChannel}
            handleUpdateGroupName={updateGroupName}
            handleRemoveChannel={handleRemove}
          />
        </Grid>
      )}
      {leftSpace !== 12 && (
        <Grid item xs={(12 - leftSpace - rightSpace) as any} className={classes.main}>
          <Main
            channelList={channelList}
            selectedChannelId={currentChannelId}
            handleBlock={handleBlock}
            rightSpace={rightSpace}
            channel={currentChannel}
            lastReadMessageIndex={
              lastReadMessageInfo.channelId === currentChannel?.sid
                ? lastReadMessageInfo.lastIndex
                : null
            }
            handleUpdateGroupName={updateGroupName}
            setRightPanel={handleOpenRightPanel}
            onSend={() => {
              if (onboardingListVisible) {
                setTimeout(() => getOnboardingList()(dispatch), 1000);
              }
            }}
          />
        </Grid>
      )}
      <Grid
        item
        xs={(rightSpace || 1) as any}
        className={rightSpace !== 0 ? classes.right : classes.hidden}
      >
        <RightMenu channel={currentChannel} />
      </Grid>
    </Grid>
  );
};

export default withWidth()(DirectChat);
