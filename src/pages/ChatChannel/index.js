// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getCampaign } from 'api/campaign';
import { withRouter } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';

import withRoot from 'withRoot';
import Layout from 'containers/Layout';
import Chat from 'containers/Chat';
import CommunityChat from 'containers/CommunityChat';
import * as notificationActions from 'actions/notifications';
import * as chatActions from 'actions/chat';
import { getChatIdFromHash } from 'api/chat';
import type { State as StoreState } from 'types/state';
import { SWITCH_CHAT_CAMPAIGN } from 'constants/campaigns';

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

const ChatChannelPage = (props) => {
  const classes = useStyles();
  const [chatId, setChatId] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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

    validateChatId();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const aCampaign = await getCampaign({ campaignId: SWITCH_CHAT_CAMPAIGN });
      setCampaign(aCampaign);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const channels = get(props, 'chat.data.channels', []);
    const channel = channels.find((e) => e.sid === chatId);
    if (!loaded && channel) {
      setLoaded(true);
      props.setCurrentChannel(channel);
    }
  }, [chatId, props, loaded]);

  const renderChat = useCallback(() => {
    return campaign && !campaign.is_disabled ? <CommunityChat /> : <Chat />;
  }, [campaign]);

  return (
    <main>
      <CssBaseline />
      <Layout>
        <Grid container justify="center" className={classes.container}>
          {loading ? <CircularProgress size={20} /> : renderChat()}
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRoot,
  withRouter
)(ChatChannelPage);
