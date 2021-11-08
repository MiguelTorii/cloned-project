import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import ChatPage from '../../containers/CommunityChat/ChatPage';
import * as notificationActions from '../../actions/notifications';
import * as chatActions from '../../actions/chat';
import { getChatIdFromHash } from '../../api/chat';
import type { State as StoreState } from '../../types/state';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex'
  },
  container: {
    height: 'calc(100vh - 68px)',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 116px)',
      marginBottom: -64
    }
  }
}));

type Props = {
  history?: string[];
  enqueueSnackbar?: (...args: Array<any>) => any;
  setCurrentChannel?: (channel: any) => void;
};

const ChatChannelPage = (props: Props) => {
  const classes: any = useStyles();
  const [chatId, setChatId] = useState('');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const validateChatId = async () => {
      const hashId = get(props, 'match.params.hashId', '');
      const resId = await getChatIdFromHash(hashId);

      if (resId) {
        setChatId(resId);
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
              autoHideDuration: 3000
            }
          }
        });
        props.history.push('/');
      }
    };

    validateChatId(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const channels = get(props, 'chat.data.channels', []);
    const channel = channels.find((e) => e.sid === chatId);

    if (!loaded && channel) {
      setLoaded(true);
      props.setCurrentChannel(channel);
    }
  }, [chatId, props, loaded]);

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justifyContent="center" className={classes.container}>
          <ChatPage />
        </Grid>
      </Layout>
    </main>
  );
};

const mapStateToProps = ({ chat }: StoreState): {} => ({
  chat
});

const mapDispatchToProps = {
  setCurrentChannel: chatActions.setCurrentChannel,
  enqueueSnackbar: notificationActions.enqueueSnackbar
};
export default compose<typeof ChatChannelPage>(
  connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps),
  withRoot,
  withRouter
)(ChatChannelPage);
