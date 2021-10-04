import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import { styles } from "../_styles/FloatingChat/ChatMessageDate";
type Props = {
  classes: Record<string, any>;
  body: string;
};

class ChatMessageDate extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      body
    } = this.props;
    return <ListItem alignItems="center">
        <ListItemText className={classes.date} primary={<Chip label={body} color="primary" variant="outlined" />} />
      </ListItem>;
  }

}

export default withStyles(styles)(ChatMessageDate);