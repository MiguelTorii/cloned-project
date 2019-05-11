/* eslint-disable jsx-a11y/anchor-is-valid, no-alert */
// @flow

import React from 'react';
import type { Node } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import withStyles from '@material-ui/core/styles/withStyles';
import logo from '../../assets/svg/circlein_logo_beta.svg';

const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  links: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
});

type Props = {
  classes: Object,
  type: string,
  children: Node,
  onReset: Function
};

type State = {};

class SignUpForm extends React.PureComponent<Props, State> {
  renderTypeLink = () => {
    const { type, onReset } = this.props;
    if (type === '') return null;

    return (
      <Typography variant="subtitle1" gutterBottom>
        {`Signing up as a ${type} student `}
        <Link component="button" onClick={onReset}>
          Change
        </Link>
      </Typography>
    );
  };

  render() {
    const { classes, children } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <img src={logo} alt="Logo" />
          <Typography component="h1" variant="h5">
            Create your CircleIn Account
          </Typography>
          {children}
          <div className={classes.links}>
            <Typography variant="subtitle1" gutterBottom>
              {'Already have an account? '}
              <Link component={MyLink} link="/login" href="/login">
                Sign in
              </Link>
            </Typography>
            {this.renderTypeLink()}
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(SignUpForm);
