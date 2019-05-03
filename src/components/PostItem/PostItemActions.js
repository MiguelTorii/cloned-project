// @flow
import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  isOwner: boolean,
  thanked: boolean,
  inStudyCircle: boolean,
  questionsCount: number,
  thanksCount: number,
  viewCount: number,
  isThanksLoading: boolean,
  isStudyCircleLoading: boolean,
  noThanks: boolean,
  onShare: Function,
  onThanks: Function,
  onStudyCircle: Function
};

class PostItemActions extends React.PureComponent<Props> {
  renderThanks = () => {
    const { thanked, isThanksLoading } = this.props;
    if (isThanksLoading) return <CircularProgress size={24} />;
    if (thanked) return <FavoriteIcon />;
    return <FavoriteBorderIcon />;
  };

  renderStudyCircle = () => {
    const { inStudyCircle, isStudyCircleLoading } = this.props;
    if (isStudyCircleLoading) return <CircularProgress size={24} />;
    if (inStudyCircle) return <FavoriteIcon />;
    return <FavoriteBorderIcon />;
  };

  render() {
    const {
      classes,
      isOwner,
      thanked,
      inStudyCircle,
      questionsCount,
      thanksCount,
      viewCount,
      noThanks,
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
          {!isOwner && (
            <Fragment>
              {!noThanks && (
                <Button aria-label="Thanks" onClick={onThanks}>
                  {this.renderThanks()}
                  <Typography
                    variant="subtitle1"
                    className={classes.buttonText}
                  >
                    {thanked ? 'Thanked' : 'Thanks'}
                  </Typography>
                </Button>
              )}
              <Button aria-label="Add to Study Circle" onClick={onStudyCircle}>
                {this.renderStudyCircle()}
                <Typography variant="subtitle1" className={classes.buttonText}>
                  {inStudyCircle ? 'Remove from' : 'Add to'} Study Circle
                </Typography>
              </Button>
            </Fragment>
          )}
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
