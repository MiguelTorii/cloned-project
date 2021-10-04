import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { styles } from "../_styles/WeeklyStudyPackCard";

const MyLink = ({
  href,
  ...props
}) => <RouterLink to={href} {...props} />;

type Props = {
  classes: Record<string, any>;
};
type State = {};

class WeeklyStudyPackCard extends React.PureComponent<Props, State> {
  static defaultProps = {};
  state = {};

  render() {
    const {
      classes
    } = this.props;
    return <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Weekly Study Pack
        </Typography>
        <div className={classes.packetsWrapper}>
          <div className={classes.packetContainer}>
            <div className={classes.packetBackground} />
          </div>
          <div className={classes.packetContainer}>
            <div className={classes.packet}>
              <Typography variant="h4" className={classes.packetText} align="center" paragraph>
                Welcome Packet
              </Typography>
              <Typography variant="h6" className={classes.packetText} align="center">
                August 2019
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.links}>
          <Typography variant="h6">
            <Link href="/" component={MyLink} color="inherit" className={classes.link}>
              View previous packets
            </Link>
          </Typography>
        </div>
      </Paper>;
  }

}

export default withStyles(styles)(WeeklyStudyPackCard);