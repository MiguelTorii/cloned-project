// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AutoComplete from '../AutoComplete';
import type { SelectType } from '../../types/models';

const styles = theme => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    marginBottom: theme.spacing.unit * 4
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  schools: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  school: ?SelectType,
  error: boolean,
  onChange: Function,
  onLoad: Function
};

class AuthSearchSchool extends React.PureComponent<Props> {
  render() {
    const { classes, school, error, onChange, onLoad } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" align="center">
            {"Enter your school's name"}
          </Typography>
          <div className={classes.schools}>
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
          </div>
          <Typography variant="subtitle1" align="center">
            {
              "By searching for and selecting your school, I agree to CircleIn's Terms of Service and Privacy Policy"
            }
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AuthSearchSchool);
