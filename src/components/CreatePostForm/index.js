// @flow

import React from 'react';
import type { Node } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import VisibilityIcon from '@material-ui/icons/Visibility';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(8)
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  visible: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  icon: {
    marginRight: theme.spacing()
  }
});

type Props = {
  classes: Object,
  title: string,
  subtitle: string,
  children: Node,
  loading: boolean,
  handleSubmit: Function
};

type State = {};

class CreatePostForm extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      title,
      subtitle,
      children,
      loading,
      handleSubmit
    } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5" paragraph>
            {title}
          </Typography>
          <Typography variant="subtitle1" paragraph align="center">
            {subtitle}
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            {children}
            <div className={classes.actions}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.submit}
                >
                  Create
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </div>
            <Typography variant="subtitle1" className={classes.visible}>
              <VisibilityIcon className={classes.icon} /> Visible to your
              classmates
            </Typography>
          </ValidatorForm>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(CreatePostForm);
