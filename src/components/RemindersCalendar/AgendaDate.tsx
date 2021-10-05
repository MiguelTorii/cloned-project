/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from '../_styles/RemindersCalendar/AgendaDate';

type Props = {
  classes: Record<string, any>;
};
type State = {};

class AgendaDate extends React.PureComponent<Props, State> {
  static navigate = (date, action) => {
    console.log(action);
    return date;
  };

  static title = (date) => `${date.toLocaleDateString()}`;

  render() {
    const { classes } = this.props;
    console.log(this.props);
    return <main className={classes.main}>date</main>;
  }
}

export default withStyles(styles as any)(AgendaDate);