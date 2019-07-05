/* eslint-disable jsx-a11y/mouse-events-have-key-events */

import React from 'react';
import Notification from 'react-web-notification';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';
import mp3Sound from '../../assets/media/sound.mp3';
import oggSound from '../../assets/media/sound.ogg';
import icon from '../../assets/img/circlein-web-notification.png';

const styles = () => ({
  main: {}
});

type Props = {
  classes: Object
};

type State = {};

class SignInPage extends React.Component<Props, State> {
  state = {
    ignore: true,
    title: ''
  };

  handlePermissionGranted = () => {
    console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  };

  handlePermissionDenied = () => {
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  };

  handleNotSupported = () => {
    console.log('Web Notification not Supported');
    this.setState({
      ignore: true
    });
  };

  handleNotificationOnClick = (e, tag) => {
    console.log(e, `Notification clicked tag:${tag}`);
  };

  handleNotificationOnError = (e, tag) => {
    console.log(e, `Notification error tag:${tag}`);
  };

  handleNotificationOnClose = (e, tag) => {
    console.log(e, `Notification closed tag:${tag}`);
  };

  handleNotificationOnShow = (e, tag) => {
    this.playSound();
    console.log(e, `Notification shown tag:${tag}`);
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

    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag,
      body,
      icon,
      lang: 'en',
      dir: 'ltr',
      sound: mp3Sound // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    };
    this.setState({
      title,
      options
    });
  };

  render() {
    const { classes } = this.props;
    const { ignore, title, options } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <div>
          <button type="submit" onClick={this.handleButtonClick}>
            Notif!
          </button>
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
        </div>
      </main>
    );
  }
}

export default withRoot(withStyles(styles)(SignInPage));
