// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ReplyIcon from '@material-ui/icons/Reply';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

const posts = [
  {
    label: 'Most Viewed',
    href: '',
    icon: <VisibilityIcon />
  },
  {
    label: 'Most Shared',
    href: '',
    icon: <ReplyIcon />
  },
  {
    label: 'Most Thanks',
    href: '',
    icon: <FavoriteBorderIcon />
  },
  {
    label: 'Most Saved',
    href: '',
    icon: <BookmarkBorderIcon />
  }
];

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
    justifyContent: 'flex-start',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: 86,
    height: 86,
    backgroundColor: theme.circleIn.palette.appBar
  }
});

type Props = {
  classes: Object
};

type State = {};

class RecommendedPostsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" paragraph>
          Recommended Posts
        </Typography>
        <div className={classes.cards}>
          {posts.map(item => (
            <ButtonBase key={item.label}>
              <Paper className={classes.card} elevation={12}>
                {item.icon}
                <Typography variant="h6" align="center">
                  {item.label}
                </Typography>
              </Paper>
            </ButtonBase>
          ))}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(RecommendedPostsCard);
