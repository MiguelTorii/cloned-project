// @flow
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Quests from './Quests';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit
  },
  link: {
    color: theme.palette.primary.main
  }
});

type Props = {
  classes: Object,
  quests?: Array<Object>
};

type State = {};

class QuestsCard extends React.PureComponent<Props, State> {
  static defaultProps = {
    quests: [
      {
        key: '1',
        title: '1000 points',
        body: 'Help your classmates get to know you better'
      },
      {
        key: '2',
        title: '2000 points',
        body: 'Help your classmates get to know you better'
      },
      {
        key: '3',
        title: '3000 points',
        body: 'Help your classmates get to know you better'
      },
      {
        key: '4',
        title: '4000 points',
        body: 'Help your classmates get to know you better'
      }
    ]
  };

  state = {};

  render() {
    const { classes, quests } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Quests
        </Typography>
        <Quests quests={quests} />
        <div className={classes.status}>
          <Typography variant="subtitle1" align="center">
            0 of 3 available quests complete
          </Typography>
          <Typography variant="subtitle1" align="center">
            0 of 3,000 available points earned
          </Typography>
        </div>
        <div className={classes.links}>
          <Typography variant="h6">
            <Link
              href="/"
              component={MyLink}
              color="inherit"
              className={classes.link}
            >
              Clear All Completed
            </Link>
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(QuestsCard);
