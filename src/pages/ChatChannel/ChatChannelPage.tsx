// TODO Remove, unused
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../../withRoot';
import Layout from '../../containers/Layout/Layout';
import ChatPage from '../../containers/CommunityChat/ChatPage';
import { getChatIdFromHash } from '../../api/chat';
import { Dispatch } from '../../types/store';
import { enqueueSnackbar } from '../../actions/notifications';
import { ChatState } from '../../reducers/chat';

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
