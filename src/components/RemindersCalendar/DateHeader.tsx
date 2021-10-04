/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { styles } from "../_styles/RemindersCalendar/DateHeader";
type Props = {
  classes: Record<string, any>;
  label: string;
  date: Record<string, any>;
  isOffRange: boolean;
  onDrillDown: (...args: Array<any>) => any;
};
type State = {};

class DateHeader extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      label,
      isOffRange,
      date,
      onDrillDown
    } = this.props;
    const today = new Date();
    const sameday = today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate();

    if (!isOffRange) {
      return <Typography variant="subtitle1" color={sameday ? 'textSecondary' : 'textPrimary'}>
          {label}
        </Typography>;
    }

    return <main className={classes.main}>
        <Typography variant="subtitle1" color={isOffRange ? 'textSecondary' : 'textPrimary'}>
          <Link href="#" onClick={onDrillDown}>
            {label}
          </Link>
        </Typography>
      </main>;
  }

}

export default withStyles(styles)(DateHeader);