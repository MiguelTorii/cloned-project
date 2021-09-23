/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import { isAndroid, isIOS, isBrowser, osVersion } from 'react-device-detect';
import {
  Link as RouterLink,
  Redirect as RouterRedirect
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
// $FlowIgnore
import { ReactComponent as Logo } from '../../assets/svg/circlein_logo.svg';
import {
  IOS_REDIRECT_URI,
  IOS_13_REDIRECT_URI,
  ANDROID_REDIRECT_URI
} from '../../constants/app';

const MyLink = ({ to, ...props }) => (
  <RouterLink to={to} {...props} target="_top" />
);

const styles = (theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    margin: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  nonce: string
};

type State = {};

class Redirect extends React.PureComponent<Props, State> {
  state = {};

  componentDidMount = () => {};

  handleAndroidClick = (nonce) => () => {
    const scheme = ANDROID_REDIRECT_URI;
    const data = `?nonce=${nonce}`;
    const packagename = 'com.circlein.android';

    const urlScheme = `${scheme}://${data}`;
    const urlStore = `https://play.google.com/store/apps/details?id=${packagename}`;
    const urlChrome = `intent://${data}#Intent;scheme=${scheme};package=${packagename};end`;

    if (navigator.userAgent.match(/OPR/)) {
      console.log('OPR');
      this.iframe(urlScheme, urlStore);
    } else if (navigator.userAgent.match(/Chrome/)) {
      console.log('Chrome');
      document.location = urlChrome;
    } else if (navigator.userAgent.match(/Firefox/)) {
      console.log('firefox');
      document.location = urlScheme;
    } else {
      console.log('default');
      this.iframe(urlScheme, urlStore);
    }
  };

  iframe = (scheme, store) => {
    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = () => {
      document.location = store;
    };
    iframe.src = scheme;
    document.body.appendChild(iframe);
  };

  render() {
    const { classes, nonce } = this.props;

    if (isBrowser) { return <RouterRedirect to={`/canvas/${nonce}`} />; }
    // console.log()
    return (
      <div className={classes.root}>
        <div className={classes.links}>
          <Logo style={{ height: 80, maxWidth: 200 }} />
          {isIOS && (
            <a
              className={classes.button}
              style={{ textDecoration: 'none' }}
              rel="noopener noreferrer"
              target="_blank"
              href={`${
                osVersion.startsWith('13')
                  ? IOS_13_REDIRECT_URI
                  : IOS_REDIRECT_URI
              }?nonce=${nonce}`}
            >
              <Button variant="contained" color="primary">
                Open iOS App
              </Button>
            </a>
          )}
          {isAndroid && (
            <Link
              className={classes.button}
              href={`${ANDROID_REDIRECT_URI}?nonce=${nonce}`}
            >
              <Button
                variant="contained"
                color="primary"
                // onClick={this.handleAndroidClick(nonce)}
              >
                Open Android App
              </Button>
            </Link>
          )}
          <Typography className={classes.button}>
            <Link component={MyLink} to={`/canvas/${nonce}`}>
              Go to Website
            </Link>
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Redirect);
