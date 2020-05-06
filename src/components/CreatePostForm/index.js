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
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  submit: {
    fontWeight: 'bold',
    [theme.breakpoints.up('sm')]: {
      width: 160,
    },
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
    },
    display: 'flex',
    flexDirection: 'column',
    border: `solid 1px ${theme.circleIn.palette.borders}`,
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing(3)}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    // justifyContent: 'flex-end'
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative',
    width: '100%',
  },
  divProgress: {
    height: theme.spacing(3)
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  visible: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    // justifyContent: 'flex-end'
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
   changed: boolean,
  buttonLabel: string,
  handleSubmit: Function
};

type State = {};

class CreatePostForm extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      title,
      buttonLabel,
      subtitle,
      children,
      loading,
      changed,
      handleSubmit
    } = this.props;

    const { location: {pathname}} = window
    const isEdit = pathname.includes('/edit')

    return (
      <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            {title && <Typography component="h1" variant="h5" paragraph>
              {title}
            </Typography>}
            {subtitle && <Typography variant="subtitle1" paragraph align="center">
              {subtitle}
            </Typography>}
            {children}
          </Paper>
          <Grid item xs={12} sm={12}>
            <div className={classes.actions}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading || (isEdit && !changed)}
                  className={classes.submit}
                >
                  {loading ? (
                    <div className={classes.divProgress}>
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    </div>
                  ) :
                    buttonLabel || 'Create'}
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle1" className={classes.visible}> 
              <VisibilityIcon className={classes.icon} /> Visible to your 
             classmates 
            </Typography>
          </Grid>
        </main>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(CreatePostForm);
