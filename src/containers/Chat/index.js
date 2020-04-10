// @flow

import React, { useState} from 'react'
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
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  },
  main: {
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  },
  right: {
    height: 'calc(100vh - 72px)',
    overflow: 'auto',
  }
}))
const Chat = ({ chat, user }: Props) => {
  const { data: { client, channels }} = chat
  const { data: { userId }} = user
  const [currentChannel, setCurrentChannel] = useState(null)
  const classes = useStyles()

  return (
    <Grid className={classes.container} direction='row' container>
      <Grid item xs={3} className={classes.left}>
        <LeftMenu
          channels={channels}
          userId={userId}
          client={client}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />
      </Grid>
      <Grid item xs={6} className={classes.main}>
        <Main
          channel={currentChannel}
          user={user}
        />
      </Grid>
      <Grid item xs={3} className={classes.right}>
        <RightMenu
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
