import React from 'react';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

import { styles } from '../_styles/SignUpForm/index';

type Props = {
  onChangeSchool: () => void;
  classes?: Record<string, any>;
  children?: React.ReactNode;
};
type State = {};

class SignUpForm extends React.PureComponent<Props, State> {
  render() {
    const { classes, children } = this.props;
    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {children}
          <div className={classes.links} />
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles as any)(SignUpForm);
