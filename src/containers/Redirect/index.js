/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import React from 'react';
import { isAndroid, isIOS } from 'react-device-detect';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as Logo } from '../../assets/svg/circlein_logo.svg';
import { IOS_REDIRECT_URI, ANDROID_REDIRECT_URI } from '../../constants/app';

const MyLink = ({ to, ...props }) => <RouterLink to={to} {...props} />;

const styles = theme => ({
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
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {};

class Redirect extends React.PureComponent<Props, State> {
  state = {};

  componentDidMount = () => {};

  render() {
    const { classes, nonce } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.links}>
          <Logo style={{ height: 80, maxWidth: 200 }} />
          {isIOS && (
            <Link
              className={classes.button}
              href={`${IOS_REDIRECT_URI}?nonce=${nonce}`}
            >
              <Button variant="contained" color="primary">
                Open iOS App
              </Button>
            </Link>
          )}
          {isAndroid && (
            <Link
              className={classes.button}
              href={`${ANDROID_REDIRECT_URI}?nonce=${nonce}`}
            >
              <Button variant="contained" color="primary">
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
