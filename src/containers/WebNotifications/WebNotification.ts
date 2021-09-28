// @flow
/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notification from 'react-web-notification';
import withRoot from '../../withRoot';
import type { WebNotificationsState } from '../../reducers/web-notifications';
import type { State as StoreState } from '../../types/state';
import mp3Sound from '../../assets/media/sound.mp3';
import oggSound from '../../assets/media/sound.ogg';
import icon from '../../assets/img/circlein-web-notification.png';
import * as webNotificationsActions from '../../actions/web-notifications';

type Props = {
  webNotifications: WebNotificationsState,
  updateTitle: Function
};

type State = {};

class WebNotification extends React.Component<Props, State> {
  state = {
    ignore: true
  };

  handlePermissionGranted = () => {
    this.setState({
      ignore: false
    });
  };

  handlePermissionDenied = () => {
    this.setState({
      ignore: true
    });
  };

  handleNotSupported = () => {
    console.log('Web Notifications not Supported');
    this.setState({
      ignore: true
    });
  };

  handleNotificationOnClick = () => {};

  handleNotificationOnError = () => {};

  handleNotificationOnClose = () => {
    const { updateTitle } = this.props;
    updateTitle({ title: '' });
  };

  handleNotificationOnShow = () => {
    this.playSound();
  };

  playSound = () => {
    // document.getElementById('sound').play();
  };

  render() {
    const {
      webNotifications: {
        data: { title, body }
      }
    } = this.props;
    const { ignore } = this.state;
    const options = {
      tag: Date.now(),
      body,
      icon,
      lang: 'en',
      dir: 'ltr',
      sound: mp3Sound
    };
    return (
      <Fragment>
        <Notification
          ignore={ignore && title !== ''}
          notSupported={this.handleNotSupported}
          onPermissionGranted={this.handlePermissionGranted}
          onPermissionDenied={this.handlePermissionDenied}
          onShow={this.handleNotificationOnShow}
          onClick={this.handleNotificationOnClick}
          onClose={this.handleNotificationOnClose}
          onError={this.handleNotificationOnError}
          timeout={5000}
          title={title}
          options={options}
        />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio id="sound" preload="auto">
          <source src={mp3Sound} type="audio/mpeg" />
          <source src={oggSound} type="audio/ogg" />
          <embed hidden autostart="false" loop={false} src={mp3Sound} />
        </audio>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ webNotifications }: StoreState): {} => ({
  webNotifications
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateTitle: webNotificationsActions.updateTitle
    },
    dispatch
  );

export default withRoot(connect(mapStateToProps, mapDispatchToProps)(WebNotification));
