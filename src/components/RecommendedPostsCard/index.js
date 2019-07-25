// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ReplyIcon from '@material-ui/icons/Reply';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing.unit * 4
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: 86,
    height: 86,
    backgroundColor: theme.circleIn.palette.appBar
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  },
  icon: {
    height: 40,
    width: 40
  }
});

type Props = {
  classes: Object,
  isLoading: boolean
};

type State = {};

class RecommendedPostsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, isLoading } = this.props;
    const posts = [
      {
        label: 'Most Viewed',
        href: '',
        icon: <VisibilityIcon className={classes.icon} />
      },
      {
        label: 'Most Shared',
        href: '',
        icon: <ReplyIcon className={classes.icon} />
      },
      {
        label: 'Most Thanks',
        href: '',
        icon: <FavoriteBorderIcon className={classes.icon} />
      },
      {
        label: 'Most Saved',
        href: '',
        icon: <BookmarkBorderIcon className={classes.icon} />
      }
    ];

    if (isLoading)
      return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Recommended Posts
        </Typography>
        <div className={classes.cards}>
          {posts.map(item => (
            <div key={item.label} className={classes.card}>
              <ButtonBase>
                <Paper className={classes.button} elevation={12}>
                  {item.icon}
                </Paper>
              </ButtonBase>
              <Typography variant="h5" align="center">
                {item.label}
              </Typography>
            </div>
          ))}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(RecommendedPostsCard);
