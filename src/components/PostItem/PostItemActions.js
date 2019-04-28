// @flow
import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonText: {
    marginLeft: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  thanked: boolean,
  inStudyCircle: boolean,
  questionsCount: number,
  thanksCount: number,
  viewCount: number,
  onShare: Function,
  onThanks: Function,
  onStudyCircle: Function
};

class PostItemActions extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount,
      onShare,
      onThanks,
      onStudyCircle
    } = this.props;

    return (
      <Fragment>
        <div className={classes.root}>
          <Button aria-label="Share" onClick={onShare}>
            <ShareIcon />
            <Typography variant="subtitle1" className={classes.buttonText}>
              Share
            </Typography>
          </Button>
          <Button aria-label="Thanks" onClick={onThanks}>
            {thanked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography variant="subtitle1" className={classes.buttonText}>
              {thanked ? 'Thanked' : 'Thanks'}
            </Typography>
          </Button>
          <Button aria-label="Add to Study Circle" onClick={onStudyCircle}>
            {inStudyCircle ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <Typography variant="subtitle1" className={classes.buttonText}>
              {inStudyCircle ? 'Added' : 'Add'} to Study Circle
            </Typography>
          </Button>
        </div>
        <div className={classes.root}>
          <Typography variant="h6" className={classes.buttonText}>
            {`${questionsCount} answers`}
          </Typography>
          <Typography variant="h6" className={classes.buttonText}>
            {`${thanksCount} thanks`}
          </Typography>
          <Typography variant="h6" className={classes.buttonText}>
            {`${viewCount} views`}
          </Typography>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemActions);
