// @flow

import React from 'react';
import cx from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import AutoComplete from '../AutoComplete';
import type { SelectType } from '../../types/models';
import canvasLogo from '../../assets/img/canvas-logo-01.png';

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
    display: 'none'
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
  lms: string,
  school: ?SelectType,
  error: boolean,
  onClick: Function,
  onChange: Function,
  onLoad: Function,
  onSubmit: Function
};

class FederatedIdentities extends React.PureComponent<Props> {
  handleClick = name => () => {
    const { onClick } = this.props;
    onClick(name);
  };

  render() {
    const {
      classes,
      lms,
      school,
      error,
      onChange,
      onLoad,
      onSubmit
    } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log in with your LMS
          </Typography>
          <div className={classes.logos}>
            <ButtonBase
              className={cx(lms === 'canvas' && classes.selected)}
              onClick={this.handleClick('canvas')}
            >
              <img
                src={canvasLogo}
                alt="Canvas Logo"
                className={classes.logo}
              />
            </ButtonBase>
          </div>
          <div className={cx(classes.options, lms !== '' && classes.show)}>
            <AutoComplete
              values={school}
              inputValue=""
              label=""
              placeholder="Select your school/college from the list"
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
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(FederatedIdentities);