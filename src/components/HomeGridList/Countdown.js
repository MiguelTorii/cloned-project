// @flow
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import type { HomeCard } from '../../types/models';
import { renderText } from './utils';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary.main,
    backgroundImage:
      'linear-gradient(160.22deg, #1B2A32 -7.42%, rgba(0, 166, 255, 0) 404.32%)'
  },
  title: {
    color: '#fec04f',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2
  },
  link: {
    margin: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  card: HomeCard,
  onOpenLeaderboard: Function
};

type State = {};

class Countdown extends React.PureComponent<Props, State> {
  render() {
    const { classes, card, onOpenLeaderboard } = this.props;
    const {
      title,
      data: {
        message: { text, style }
      }
    } = card;

    // eslint-disable-next-line no-script-url
    const dudUrl = 'javascript:;';
    return (
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h4" className={classes.title} paragraph>
            {title}
          </Typography>
          <Typography variant="h5">{renderText(text, style)}</Typography>
          <div className={classes.links}>
            <Typography>
              <Link
                href="/store"
                component={MyLink}
                color="inherit"
                className={classes.link}
              >
                Reward Store
              </Link>
            </Typography>
            <Typography>
              <Link
                href={dudUrl}
                onClick={onOpenLeaderboard}
                color="inherit"
                className={classes.link}
              >
                Leaderboard
              </Link>
            </Typography>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(Countdown);
