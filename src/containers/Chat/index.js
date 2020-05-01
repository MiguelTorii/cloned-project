// @flow

import React, { useMemo, useCallback, useEffect, useState} from 'react'
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import * as chatActions from 'actions/chat';
import { bindActionCreators } from 'redux';
import { push as routePush } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import LeftMenu from 'containers/Chat/LeftMenu'
import RightMenu from 'containers/Chat/RightMenu'
import Main from 'containers/Chat/Main'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import { blockUser } from '../../api/user';
import type { State as StoreState } from '../../types/state';

type Props = {
  chat: ChatState,
  user: UserState,
  width: string
};

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    height: 'inherit'
  },
  left: {
    height: '100%',
    position: 'relative',
    overflow: 'auto',
  },
  main: {
    display: 'flex',
    position: 'relative',
    borderLeft: '1px solid rgba(255,255,255,0.15)',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    overflow: 'auto',
    height: '100%',
  },
  right: {
    height: '100%',
    overflow: 'auto',
  },
  hidden: {
    border: 'none',
    display: 'none'
  }
}))

const Chat = ({
  handleRemoveChannel,
  handleUpdateUnreadCount,
  handleInitChat,
  handleShutdownChat,
  handleBlockUser,
  width,
  chat,
  user
}: Props) => {
  const { data: { client, channels, newMessage }} = chat
  const { data: { userId, schoolId }} = user
  const [currentChannel, setCurrentChannel] = useState(null)
  const classes = useStyles()
  const [leftSpace, setLeftSpace] = useState(3)
  const [rightSpace, setRightSpace] = useState(0)
  const [prevWidth, setPrevWidth] = useState(null)

  const clearCurrentChannel = useCallback(() => setCurrentChannel(null), [])

  const curSize = useMemo(() => width === 'xs' ? 6 : 3, [width])

  useEffect(() => {
    if(width !== prevWidth) {
      if (['xs'].includes(width)) {
        setRightSpace(0)
        if(currentChannel) setLeftSpace(0)
        else setLeftSpace(curSize)
      } else {
        setLeftSpace(curSize)
        if(currentChannel) setRightSpace(3)
        else setRightSpace(0)
      }
    }

    setPrevWidth(width)
  }, [prevWidth, width, curSize, currentChannel])

  useEffect(() => {
    const handleInitChatDebounce = debounce(handleInitChat, 1000);
    handleInitChatDebounce();

    return () => {
      if (
        handleInitChatDebounce.cancel &&
      typeof handleInitChatDebounce.cancel === 'function'
      )
        handleInitChatDebounce.cancel();
      handleShutdownChat();
    };

  }, [handleInitChat, handleShutdownChat])

  useEffect(() => {
    if (currentChannel && width !== 'xs') setRightSpace(3)
    if (!currentChannel) setRightSpace(0)
  }, [currentChannel, width])

  const handleBlock = async blockedUserId => {
    try {
      await blockUser({ userId, blockedUserId: String(blockedUserId) });
      await handleBlockUser({ blockedUserId });
      setCurrentChannel(null)
    } catch (err) {}
  }

  const onCollapseLeft = useCallback(() => {
    if (width === 'xs') {
      setRightSpace(0)
    }
    setLeftSpace(leftSpace ? 0 : curSize)
  }, [width, curSize, leftSpace])

  const onCollapseRight = useCallback(() => {
    if (width === 'xs') {
      setLeftSpace(0)
    }
    setRightSpace(rightSpace ? 0 : curSize)
  }, [width, curSize, rightSpace])

  return (
    <Grid className={classes.container} direction='row' container>
      <Grid item xs={leftSpace || 1} className={leftSpace !== 0 ? classes.left: classes.hidden}>
        <LeftMenu
          channels={channels}
          handleUpdateUnreadCount={handleUpdateUnreadCount}
          userId={userId}
          client={client}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />
      </Grid>
      <Grid item xs={12-leftSpace-rightSpace} className={classes.main}>
        <Main
          newMessage={newMessage}
          onCollapseLeft={onCollapseLeft}
          onCollapseRight={onCollapseRight}
          leftSpace={leftSpace}
          rightSpace={rightSpace}
          channel={currentChannel}
          user={user}
        />
      </Grid>
      <Grid item xs={rightSpace || 1} className={rightSpace !==0 ? classes.right : classes.hidden}>
        <RightMenu
          handleRemoveChannel={handleRemoveChannel}
          handleBlock={handleBlock}
          userId={userId}
          schoolId={schoolId}
          channel={currentChannel}
          clearCurrentChannel={clearCurrentChannel}
        />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = ({ user, chat }: StoreState): {} => ({
  user,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      push: routePush,
      handleInitChat: chatActions.handleInitChat,
      handleShutdownChat: chatActions.handleShutdownChat,
      handleBlockUser: chatActions.handleBlockUser,
      handleRemoveChannel: chatActions.handleRemoveChannel,
      handleUpdateUnreadCount: chatActions.handleUpdateUnreadCount,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(Chat));
