// @flow

import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';

import withRoot from 'withRoot';
import Layout from 'containers/Layout';
import Chat from 'containers/Chat';
import * as notificationActions from 'actions/notifications'
import * as chatActions from 'actions/chat';
import { getChatIdFromHash } from 'api/chat';
import type { State as StoreState } from 'types/state';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex'
  },
  container: {
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 116px)',
      marginBottom: -64
    }
  }
}));

const ChatChannelPage = (props) => {
  const classes = useStyles();
  const { current: hashId } = useRef(get(props, 'match.params.hashId', ''));
  const [ chatId, setChatId ] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const validateChatId = async () => {
      const chatId = await getChatIdFromHash(hashId);

      if (chatId) {
        setChatId(chatId);
      } else {
        // invalid channel, redirect to homepage with notification
        props.enqueueSnackbar({
          notification: {
            message: 'Chat link is invalid!',
            options: {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000,
            }
          }
        });
        props.history.push('/');
      }
    };

    validateChatId();
  }, [hashId, props]);

  useEffect(() => {
    const channels = get(props, 'chat.data.channels', []);
    const channel = channels.find(e => e.sid === chatId);
    if (!loaded && channel) {
      setLoaded(true);
      props.setCurrentChannel(channel);
    }
  }, [chatId, props, loaded]);

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justify="center" className={classes.container}>
          <Chat />
        </Grid>
      </Layout>
    </main>
  );
};

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat,
});

const mapDispatchToProps = {
  setCurrentChannel: chatActions.setCurrentChannel,
  enqueueSnackbar: notificationActions.enqueueSnackbar,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRoot,
  withRouter
)(ChatChannelPage);
