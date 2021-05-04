// @flow

import React from 'react';
import type { Node } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid'

import { styles } from '../_styles/CreatePostForm';

type Props = {
  classes: Object,
  title: string,
  subtitle: string,
  children: Node,
  loading: boolean,
  errorMessage: ?string,
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
      errorMessage,
      handleSubmit
    } = this.props;

    const { location: { pathname } } = window
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
                  disabled={Boolean(loading || (isEdit && !changed) || errorMessage)}
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
            {errorMessage}
            <Typography variant="subtitle1" className={classes.visible}>
              <VisibilityIcon className={classes.icon} /> Visible to your classmates
            </Typography>
          </Grid>
        </main>
      </ValidatorForm>
    );
  }
}

export default withStyles(styles)(CreatePostForm);
