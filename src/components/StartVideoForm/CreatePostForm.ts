// @flow

import React from 'react';
import type { Node } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from '../_styles/StartVideoForm';

type Props = {
  classes: Object,
  title: string,
  children: Node,
  // loading: boolean,
  handleSubmit: Function
};

type State = {};

class CreatePostForm extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      title,
      children,
      // loading,
      handleSubmit
    } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
            {children}
            {/* <div className={classes.actions}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.submit}
                >
                  Start
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </div> */}
          </ValidatorForm>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(CreatePostForm);
