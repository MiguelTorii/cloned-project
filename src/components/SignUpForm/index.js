/* eslint-disable jsx-a11y/anchor-is-valid, no-alert */
// @flow

import React from 'react';
import type { Node } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
// import Link from '@material-ui/core/Link';
// import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

// const MyLink = ({ link, ...props }) => <RouterLink to={link} {...props} />;

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    padding: theme.spacing(4),
    paddingTop: theme.spacing(5),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  links: {
    width: '100%',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
});

type Props = {
  classes: Object,
  // type: string,
  children: Node,
  // onReset: Function
  // onChangeSchool: Function
};

type State = {};

class SignUpForm extends React.PureComponent<Props, State> {
  // renderTypeLink = () => {
  //   const { type, onReset } = this.props;
  //   if (type === '') return null;

  //   return (
  //     <Typography variant="subtitle1" gutterBottom>
  //       {`Signing up as a ${type} student `}
  //       <Link component="button" onClick={onReset}>
  //         Change
  //       </Link>
  //     </Typography>
  //   );
  // };

  render() {
    const { 
      classes, 
      children, 
      // onChangeSchool
    } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {children}
          <div className={classes.links}>
            {/* <Typography variant="subtitle1" gutterBottom>
              {'Already have an account? '}
              <Link component={MyLink} link="/login" href="/login">
                Sign in
              </Link>
            </Typography> */}
            {/* <Button variant="outlined" color="primary" onClick={onChangeSchool}>
              Select a Different School
            </Button> */}
            {/* {this.renderTypeLink()} */}
          </div>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(SignUpForm);
