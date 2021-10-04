/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { styles } from "../_styles/RemindersCalendar/Event";
type Props = {
  classes: Record<string, any>;
  title: string;
};
type State = {};

class Event extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      title
    } = this.props;
    return <main className={classes.main}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
      </main>;
  }

}

export default withStyles(styles)(Event);