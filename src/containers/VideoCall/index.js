// @flow
import React, { Fragment } from 'react';
import Chat from 'twilio-chat';
import { connect } from 'react-redux';
import adapter from 'webrtc-adapter';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import { renewTwilioToken } from '../../api/chat';
import Preview from './Preview';
import MeetUp from './MeetUp';
import SimpleErrorDialog from '../../components/SimpleErrorDialog';

const styles = () => ({
  root: {
    position: 'relative'
  },
  loading: {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000
  }
});

type Props = {
  classes: Object,
  roomId: string,
  user: UserState
};

type State = {
  loading: boolean,
  join: boolean,
  selectedaudioinput: string,
  selectedvideoinput: string,
  isVideoEnabled: boolean,
  isAudioEnabled: boolean,
  errorDialog: boolean,
  errorTitle: string,
  errorBody: string
};

class VideoCall extends React.Component<Props, State> {
  state = {
    loading: true,
    join: false,
    selectedaudioinput: '',
    selectedvideoinput: '',
    isVideoEnabled: true,
    isAudioEnabled: true,
    errorDialog: false,
    errorTitle: '',
    errorBody: ''
  };

  componentDidMount = () => {
    if (adapter.browserDetails.browser === 'firefox') {
      adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }
  };

  handleMediaInput = (input, mediaId) => {
    this.setState({ [input]: mediaId });
  };

  handlePreviewMediaState = (media, state) => {
    this.setState({ [media]: state });
  };

  handleJoinRoom = async () => {
    const {
      user: {
        data: { userId, firstName, lastName }
      },
      roomId
    } = this.props;
    this.setState({ loading: true });
    try {
      const accessToken = await renewTwilioToken({
        userId
      });
      const client = await Chat.create(accessToken);
      const channel = await client.getChannelBySid(roomId);
      const messageAttributes = {
        firstName,
        lastName,
        imageKey: '',
        isVideoNotification: true
      };
      channel.sendMessage('Joined Video', messageAttributes);
      this.setState({ join: true });
    } catch (err) {
      this.setState({
        errorDialog: true,
        errorTitle: 'Not Allowed',
        errorBody: 'You are not allowed to access this room'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLeaveRoom = () => {
    this.setState({
      join: false,
      selectedaudioinput: '',
      selectedvideoinput: '',
      isVideoEnabled: true,
      isAudioEnabled: true
    });
  };

  handleUpdateLoading = loading => {
    this.setState({ loading });
  };

  handleErrorDialogClose = () => {
    this.setState({ errorDialog: false, errorTitle: '', errorBody: '' });
  };

  renderComponent = () => {
    const {
      roomId,
      user: { data }
    } = this.props;
    const {
      join,
      selectedvideoinput,
      selectedaudioinput,
      isVideoEnabled,
      isAudioEnabled
    } = this.state;
    if (!join) {
      return (
        <Preview
          user={data}
          selectedvideoinput={selectedvideoinput}
          selectedaudioinput={selectedaudioinput}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          roomName={roomId}
          updateMediaInput={this.handleMediaInput}
          updateMediaState={this.handlePreviewMediaState}
          joinRoom={this.handleJoinRoom}
          updateLoading={this.handleUpdateLoading}
        />
      );
    }
    return (
      <MeetUp
        user={data}
        videoinput={selectedvideoinput}
        audioinput={selectedaudioinput}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        roomName={roomId}
        leaveRoom={this.handleLeaveRoom}
        updateLoading={this.handleUpdateLoading}
      />
    );
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { loading, errorDialog, errorTitle, errorBody } = this.state;
    if (userId === '')
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );

    return (
      <div className={classes.root}>
        <Fragment>
          {loading && (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          )}
          {this.renderComponent()}
          <SimpleErrorDialog
            open={errorDialog}
            title={errorTitle}
            body={errorBody}
            handleClose={this.handleErrorDialogClose}
          />
        </Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(VideoCall));
