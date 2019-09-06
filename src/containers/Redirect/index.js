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

const MyLink = props => <RouterLink to="/open-collective" {...props} />;

const styles = () => ({
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
              href={`https://redirect-dev.circleinapp.com/login?nonce=${nonce}`}
            >
              <Button variant="contained" color="primary">
                Open iOS App
              </Button>
            </Link>
          )}
          {isAndroid && (
            <Link
              className={classes.button}
              href={`circleinapp://dev-app2.circleinapp.com/oauth?nonce=${nonce}`}
            >
              <Button variant="contained" color="primary">
                Open iOS App
              </Button>
            </Link>
          )}
          <Typography>
            <Link component={MyLink}>Go to Website</Link>
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Redirect);
