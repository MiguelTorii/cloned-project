/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React, { Fragment } from 'react';
import Notification from 'react-web-notification';
import withRoot from '../../withRoot';
import mp3Sound from '../../assets/media/sound.mp3';
import oggSound from '../../assets/media/sound.ogg';
import icon from '../../assets/img/circlein-web-notification.png';

type Props = {};

type State = {};

class WebNotification extends React.Component<Props, State> {
  state = {
    ignore: true,
    title: ''
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

  handleNotificationOnClose = () => {};

  handleNotificationOnShow = () => {
    this.playSound();
  };

  playSound = () => {
    document.getElementById('sound').play();
  };

  handleButtonClick = () => {
    const { ignore } = this.state;
    if (ignore) {
      return;
    }

    const now = Date.now();

    const title = `React-Web-Notification${now}`;
    const body = `Hello${new Date()}`;
    const tag = now;
    const options = {
      tag,
      body,
      icon,
      lang: 'en',
      dir: 'ltr',
      sound: mp3Sound
    };
    this.setState({
      title,
      options
    });
  };

  render() {
    const { ignore, title, options } = this.state;

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

export default withRoot(WebNotification);
