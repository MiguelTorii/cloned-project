/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from '../_styles/RemindersCalendar/EventWrapper';

type Props = {
  classes: Record<string, any>;
  children: React.ReactNode;
};
type State = {};

class EventWrapper extends React.PureComponent<Props, State> {
  render() {
    const { classes, children } = this.props;
    return <main className={classes.main}>{children}</main>;
  }
}

export default withStyles(styles as any)(EventWrapper);
