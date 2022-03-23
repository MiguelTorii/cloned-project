// TODO Remove, unused
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { enqueueSnackbar } from 'actions/notifications';
import { getChatIdFromHash } from 'api/chat';
import ChatPage from 'containers/CommunityChat/ChatPage';
import Layout from 'containers/Layout/Layout';
import withRoot from 'withRoot';

import type { ChatState } from 'reducers/chat';
import type { Dispatch } from 'types/store';

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
};

const ChatChannelPage = ({ history }: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const channels = useSelector((state: { chat: ChatState }) => state.chat.data.channels);

  const { hashId } = useParams();

  const [chatId, setChatId] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const validateChatId = async () => {
      const resId = await getChatIdFromHash(hashId);

      if (resId) {
        setChatId(resId);
      } else {
        // invalid channel, redirect to homepage with notification
        enqueueSnackbar({
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
        })(dispatch);
        history.push('/');
      }
    };

    validateChatId(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const channel = channels.find((e) => e.sid === chatId);

    if (!loaded && channel) {
      setLoaded(true);
    }
  }, [chatId, history, loaded, channels]);

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

export default withRoot(withRouter(ChatChannelPage));
