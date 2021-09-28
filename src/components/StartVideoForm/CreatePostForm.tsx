import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { styles } from '../_styles/StartVideoForm';

type Props = {
  classes: Record<string, any>;
  title: string;
  children: React.ReactNode;
  handleSubmit: (...args: Array<any>) => any;
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
          </ValidatorForm>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles as any)(CreatePostForm);
