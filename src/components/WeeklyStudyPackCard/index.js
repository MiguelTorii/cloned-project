// @flow
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: '100%'
  },
  packetsWrapper: {
    width: '100%',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    position: 'relative',
    height: 170
  },
  packetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170
  },
  packet: {
    width: 180,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  packetBackground: {
    backgroundColor: '#f9f9f9',
    opacity: 0.8,
    width: 180,
    height: 120,
    borderRadius: 8,
    marginLeft: 10,
    marginTop: 10
  },
  packetText: {
    color: theme.circleIn.palette.normalButtonText1
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: theme.palette.primary.main
  }
});

type Props = {
  classes: Object
};

type State = {};

class WeeklyStudyPackCard extends React.PureComponent<Props, State> {
  static defaultProps = {};

  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Weekly Study Pack
        </Typography>
        <div className={classes.packetsWrapper}>
          <div className={classes.packetContainer}>
            <div className={classes.packetBackground} />
          </div>
          <div className={classes.packetContainer}>
            <div className={classes.packet}>
              <Typography
                variant="h4"
                className={classes.packetText}
                align="center"
                paragraph
              >
                Welcome Packet
              </Typography>
              <Typography
                variant="h6"
                className={classes.packetText}
                align="center"
              >
                August 2019
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.links}>
          <Typography variant="h6">
            <Link
              href="/"
              component={MyLink}
              color="inherit"
              className={classes.link}
            >
              View previous packets
            </Link>
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(WeeklyStudyPackCard);
