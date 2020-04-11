// @flow

import React, { useEffect, useState} from 'react'
import { connect } from 'react-redux';
import * as chatActions from 'actions/chat';
import { bindActionCreators } from 'redux';
import { push as routePush } from 'connected-react-router';
import Grid from '@material-ui/core/Grid';
import LeftMenu from 'containers/Chat/LeftMenu'
import RightMenu from 'containers/Chat/RightMenu'
import Main from 'containers/Chat/Main'
import { makeStyles } from '@material-ui/core/styles'
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import { blockUser } from '../../api/user';
import type { State as StoreState } from '../../types/state';

type Props = {
  chat: ChatState,
  user: UserState
};

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative'
  },
  left: {
    position: 'relative',
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  },
  main: {
    position: 'relative',
    borderLeft: '1px solid rgba(255,255,255,0.15)',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  },
  right: {
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  },
  hidden: {
    border: 'none',
    display: 'none'
  }
}))

const Chat = ({ handleBlockUser, chat, user }: Props) => {
  const { data: { client, channels }} = chat
  const { data: { userId }} = user
  const [currentChannel, setCurrentChannel] = useState(null)
  const classes = useStyles()
  const [leftSpace, setLeftSpace] = useState(3)
  const [rightSpace, setRightSpace] = useState(0)

  useEffect(() => {
    if (channels.length > 0) {
      setCurrentChannel(channels[0])
    }
  }, [channels])

  useEffect(() => {
    if (currentChannel) setRightSpace(3)
  }, [currentChannel])

  const handleBlock = blockedUserId => async () => {
    try {
      await blockUser({ userId, blockedUserId: String(blockedUserId) });
      await handleBlockUser({ blockedUserId });
    } catch (err) {}
  }

  const onCollapseLeft = () => setLeftSpace(leftSpace ? 0 : 3)
  const onCollapseRight = () => setRightSpace(rightSpace ? 0 : 3)

  return (
    <Grid className={classes.container} direction='row' container>
      <Grid item xs={3} className={leftSpace !== 0 ? classes.left: classes.hidden}>
        <LeftMenu
          channels={channels}
          userId={userId}
          client={client}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />
      </Grid>
      <Grid item xs={12-leftSpace-rightSpace} className={classes.main}>
        <Main
          onCollapseLeft={onCollapseLeft}
          onCollapseRight={onCollapseRight}
          leftSpace={leftSpace}
          rightSpace={rightSpace}
          channel={currentChannel}
          user={user}
        />
      </Grid>
      <Grid item xs={3} className={rightSpace !==0 ? classes.right : classes.hidden}>
        <RightMenu
          handleBlock={handleBlock}
          userId={userId}
          channel={currentChannel}
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
      handleRoomClick: chatActions.handleRoomClick,
      updateOpenChannels: chatActions.updateOpenChannels,
      handleChannelClose: chatActions.handleChannelClose,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
