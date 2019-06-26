// @flow

import React from 'react';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AutoComplete from '../AutoComplete';
import type { SelectType } from '../../types/models';

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
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  logos: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  logo: {
    width: 200
  },
  selected: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: theme.circleIn.palette.action
  },
  options: {
    display: 'none',
    marginTop: theme.spacing.unit * 2
  },
  show: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  button: {
    marginTop: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  school: ?SelectType,
  error: boolean,
  onChange: Function,
  onLoad: Function,
  onSubmit: Function
};

class FederatedIdentities extends React.PureComponent<Props> {
  render() {
    const { classes, school, error, onChange, onLoad, onSubmit } = this.props;
    return (
      <main className={classes.main}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log in with your LMS
          </Typography>
          <div className={cx(classes.options, classes.show)}>
            <AutoComplete
              values={school}
              inputValue=""
              label=""
              placeholder="Search your school/college"
              error={error}
              errorText="You must select an option"
              onChange={onChange}
              onLoadOptions={onLoad}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={!school}
              onClick={onSubmit}
            >
              Log In
            </Button>
          </div>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(FederatedIdentities);
