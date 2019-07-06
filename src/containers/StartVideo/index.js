// @flow

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Chat from 'twilio-chat';
// import { SelectValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import FormControl from '@material-ui/core/FormControl';
// import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';
import StartVideoForm from '../../components/StartVideoForm';
import CreateChatChannel from '../CreateChatChannel';
// import { getTitle } from '../FloatingChat/utils';
import { renewTwilioToken } from '../../api/chat';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  actions: {
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  start: {
    maxWidth: 200,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  loading: boolean,
  channel: string,
  client: ?Object,
  channels: Array<Object>,
  // channelList: Array<Object>,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string,
  createChannel: ?string,
  online: boolean
};

class StartVideo extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    channel: '',
    client: null,
    channels: [],
    // channelList: [],
    errorDialog: false,
    errorTitle: '',
    errorBody: '',
    createChannel: 'single',
    online: true
  };

  componentDidMount = () => {
    this.mounted = true;
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    window.addEventListener('offline', () => {
      console.log('**** offline ****');
      this.setState({ online: false });
      this.handleShutdownChat();
    });
    window.addEventListener('online', () => {
      console.log('**** online ****');
      this.setState({ online: true });
    });

    if (userId !== '') this.handleInitChat();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId }
      }
    } = prevProps;
    const { online } = this.state;
    if (prevUserId !== '' && userId === '') {
      this.handleShutdownChat();
    } else if (
      (prevUserId === '' && userId !== '' && online) ||
      (userId !== '' && online && !prevState.online)
    ) {
      this.handleInitChat();
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
    this.handleShutdownChat();
  };

  handleShutdownChat = () => {
    const { client } = this.state;
    if (client) {
      client.shutdown();
    }
    if (this.mounted) this.setState({ client: null, channels: [] });
  };

  handleInitChat = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      const accessToken = await renewTwilioToken({
        userId
      });
      const client = await Chat.create(accessToken);

      let paginator = await client.getSubscribedChannels();
      while (paginator.hasNextPage) {
        // eslint-disable-next-line no-await-in-loop
        paginator = await paginator.nextPage();
      }
      const channels = await client.getLocalChannels({
        criteria: 'lastMessage',
        order: 'descending'
      });
      // const channelList = channels.map(channel => ({
      //   value: channel.sid,
      //   label: getTitle(channel, userId)
      // }));
      this.setState({
        client,
        channels
        // channelList
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleChange = event => {
    this.setState({ channel: event.target.value });
  };

  handleSubmit = () => {
    const { channel } = this.state;
    logEvent({
      event: 'Video- Start Video',
      props: { 'Initiated From': 'Video' }
    });
    const win = window.open(`/video-call/${channel}`, '_blank');
    win.focus();
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  handleCreateChannelClose = () => {
    this.setState({ createChannel: null });
  };

  handleCreateChannelOpen = type => () => {
    this.setState({ createChannel: type });
  };

  handleChannelCreated = ({
    channel,
    isNew
  }: {
    channel: Object,
    isNew: boolean
  }) => {
    if (isNew) {
      // const {
      //   user: {
      //     data: { userId }
      //   }
      // } = this.props;
      // const newChannel = {
      //   value: channel.sid,
      //   label: getTitle(channel, userId)
      // };
      this.setState(({ channels }) => ({
        // channelList
        channels: [channel, ...channels],
        // channelList: [newChannel, ...channelList],
        channel: channel.sid
      }));
      this.handleSubmit();
    } else {
      this.setState(() => ({ channel: channel.sid }));
      this.handleSubmit();
    }
  };

  mounted: boolean;

  render() {
    const { classes } = this.props;
    const {
      loading,
      createChannel,
      client,
      // channel,
      channels,
      // channelList,
      errorDialog,
      errorTitle,
      errorBody
    } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <div className={classes.root}>
            <StartVideoForm
              title="Video Meet Up"
              loading={loading}
              handleSubmit={this.handleSubmit}
            >
              <div className={classes.actions}>
                <Button
                  className={classes.start}
                  variant="contained"
                  size="large"
                  color="primary"
                  disabled={loading}
                  onClick={this.handleCreateChannelOpen('single')}
                >
                  Start a Meet Up with your classmates
                </Button>
              </div>
              {/* <Grid container alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Select People</Typography>
                </Grid>
                <Grid item xs={10}>
                  <FormControl variant="outlined" fullWidth>
                    <SelectValidator
                      disabled={loading}
                      value={channel}
                      name="channel"
                      label="Chat"
                      onChange={this.handleChange}
                      variant="outlined"
                      validators={['required']}
                      errorMessages={['You have to select a chat']}
                    >
                      <MenuItem value="" />
                      {channelList.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </SelectValidator>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Or Create a New</Typography>
                </Grid>
                <Grid item xs={10} className={classes.actions}>
                  <Button
                    className={classes.margin}
                    variant="outlined"
                    color="primary"
                    disabled={loading}
                    onClick={this.handleCreateChannelOpen('single')}
                  >
                    1-to-1 Chat
                  </Button>
                  <Button
                    className={classes.margin}
                    variant="outlined"
                    color="primary"
                    disabled={loading}
                    onClick={this.handleCreateChannelOpen('group')}
                  >
                    Group Chat
                  </Button>
                </Grid>
              </Grid> */}
            </StartVideoForm>
            <SimpleErrorDialog
              open={errorDialog}
              title={errorTitle}
              body={errorBody}
              handleClose={this.handleErrorDialogClose}
            />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <CreateChatChannel
            type={loading ? null : createChannel}
            client={client}
            channels={channels}
            isVideo
            onClose={this.handleCreateChannelClose}
            onChannelCreated={this.handleChannelCreated}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(StartVideo));
