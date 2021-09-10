/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/media-has-caption */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from 'containers/Tooltip/Tooltip';
import type { User } from '../../types/models';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import MeetupPreview from '../../components/MeetUpPreview/Preview';

const styles = () => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewWrapper: {
    width: 200,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  video: {
    height: '100% !important',
    width: 'auto !important'
  }
});

type Props = {
  classes: Object,
  user: User,
  roomName: string,
  onJoin: Function
};

class Preview extends React.Component<Props, State> {
  handleJoin = () => {
    const {
      audioinputEnabled,
      videoinputEnabled,
      selectedaudioinput,
      selectedvideoinput,
      onJoin
    } = this.props;

    onJoin({
      audioinput: audioinputEnabled ? selectedaudioinput : '',
      videoinput: videoinputEnabled ? selectedvideoinput : ''
    });
  };

  render() {
    const {
      classes,
      user: { firstName, lastName, profileImage },
      roomName,
      audioinput,
      audiooutput,
      videoinput,
      selectedvideoinput,
      selectedaudioinput,
      selectedaudiooutput,
      videoinputEnabled,
      audioinputEnabled,
      error,
      onUpdateDeviceSelection,
      onDisableDevice,
      meetupPreview,
      pushTo
    } = this.props;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <MeetupPreview
            pushTo={pushTo}
            innerRef={meetupPreview}
            roomName={roomName}
            firstName={firstName}
            lastName={lastName}
            profileImage={profileImage}
            audioinput={audioinput}
            videoinput={videoinput}
            audiooutput={audiooutput}
            selectedvideoinput={selectedvideoinput}
            selectedaudioinput={selectedaudioinput}
            selectedaudiooutput={selectedaudiooutput}
            isVideoEnabled={videoinputEnabled}
            isAudioEnabled={audioinputEnabled}
            error={error}
            onUpdateDeviceSelection={onUpdateDeviceSelection}
            onDisableDevice={onDisableDevice}
            onJoin={this.handleJoin}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(Preview);
