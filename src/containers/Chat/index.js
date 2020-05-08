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
import IconButton from '@material-ui/core/IconButton';
import cx from 'classnames'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment'
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import { blockUser } from '../../api/user';
import type { State as StoreState } from '../../types/state';

type Props = {
  chat: ChatState,
  user: UserState,
  width: string
};

const useStyles = makeStyles(theme => ({
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
  },
  rightDrawerClose: {
    right: 0,
  },
  rightDrawerOpen: {
    right: '24%',
    [theme.breakpoints.down('xs')]: {
      right: '48%'
    }
  },
  leftDrawerClose: {
    left: 0,
  },
  leftDrawerOpen: {
    left: '24%',
    [theme.breakpoints.down('xs')]: {
      left: '48%'
    }
  },
  iconButton: {
    position: 'absolute',
    top: 60,
    padding: 0,
    border: '1px solid white',
    zIndex: 1002
  },
  icon: {
    fontSize: 16,
  },
}))

const Chat = ({
  handleRemoveChannel,
  handleInitChat,
  handleShutdownChat,
  handleBlockUser,
  width,
  chat,
  user
}: Props) => {
  const { data: { client, channels, newMessage, local }} = chat
  const { data: { userId, schoolId }} = user
  const [currentChannel, setCurrentChannel] = useState(null)
  const classes = useStyles()
  const [leftSpace, setLeftSpace] = useState(3)
  const [rightSpace, setRightSpace] = useState(0)
  const [prevWidth, setPrevWidth] = useState(null)
  const [channelList, setChannelList] = useState([])

  const clearCurrentChannel = useCallback(() => setCurrentChannel(null), [])

  const curSize = useMemo(() => width === 'xs' ? 6 : 3, [width])

  useEffect(() => {
    const channelList = Object.keys(local).filter(l => local[l].sid).sort((a, b) => {
      if (local[a].lastMessage.message === '') return 0
      return moment(local[b].lastMessage.date).valueOf() - moment(local[a].lastMessage.date).valueOf()
    })
    setChannelList(channelList)
  }, [local])

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


  const renderIcon = d => {
    return ( d
      ? <ArrowBackIcon className={classes.icon} />
      : <ArrowForwardIcon className={classes.icon} />
    )}

  return (
    <Grid className={classes.container} direction='row' container>
      <IconButton
        className={cx(
          leftSpace !== 0 ? classes.leftDrawerOpen : classes.leftDrawerClose,
          classes.iconButton
        )}
        onClick={onCollapseLeft}
      >
        {renderIcon(leftSpace !== 0)}
      </IconButton>
      {currentChannel && <IconButton
        className={cx(
          rightSpace !== 0 ? classes.rightDrawerOpen : classes.rightDrawerClose,
          classes.iconButton
        )}
        onClick={onCollapseRight}
      >
        {renderIcon(rightSpace === 0)}
      </IconButton>}
      <Grid item xs={leftSpace || 1} className={leftSpace !== 0 ? classes.left: classes.hidden}>
        <LeftMenu
          channels={channels}
          channelList={channelList}
          local={local}
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
          local={local}
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
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(Chat));
