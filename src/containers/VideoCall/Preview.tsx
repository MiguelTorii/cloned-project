/* eslint-disable no-restricted-syntax */

/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import MeetupPreview from 'components/MeetUpPreview/Preview';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import type { User } from 'types/models';

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
  classes: Record<string, any>;
  user: User;
  roomName: string;
  onJoin: (...args: Array<any>) => any;
  audioinput: any;
  audiooutput: any;
  videoinput: any;
  selectedvideoinput: any;
  selectedaudioinput: any;
  selectedaudiooutput: any;
  videoinputEnabled: any;
  audioinputEnabled: any;
  error: any;
  onUpdateDeviceSelection: any;
  onDisableDevice: any;
  meetupPreview: any;
  pushTo: any;
  updateLoading: any;
};

type State = {};

class Preview extends React.Component<Props, State> {
  handleJoin = () => {
    const { audioinputEnabled, videoinputEnabled, selectedaudioinput, selectedvideoinput, onJoin } =
      this.props;
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
      pushTo,
      updateLoading
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

export default withStyles(styles as any)(Preview);
