import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import commentSvg from 'assets/svg/comment.svg';
import { ReactComponent as ThanksIcon } from 'assets/svg/ic_thanks_hands.svg';
import thanksSvg from 'assets/svg/thanks.svg';
import Tooltip from 'containers/Tooltip/Tooltip';

import { styles } from '../_styles/PostItem/PostItemActions';

type Props = {
  classes?: Record<string, any>;
  isOwner?: boolean;
  thanked?: boolean;
  inStudyCircle?: boolean;
  questionsCount?: number;
  thanksCount?: number;
  viewCount?: number;
  isThanksLoading?: boolean;
  isStudyCircleLoading?: boolean;
  noThanks?: boolean;
  onThanks?: (...args: Array<any>) => any;
  isQuestion?: boolean;
  onStudyCircle?: any;
};

class PostItemActions extends React.PureComponent<Props> {
  renderThanks = () => {
    const { thanked, isThanksLoading } = this.props;

    if (isThanksLoading) {
      return <CircularProgress size={24} />;
    }

    if (thanked) {
      return <ThanksIcon />;
    }

    return <ThanksIcon />;
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
      onThanks,
      isQuestion,
      onStudyCircle
    } = this.props;
    return (
      <>
        <div className={classes.root}>
          <div className={classes.buttonActions}>
            {!isOwner && (
              <>
                {!noThanks && (
                  <Button aria-label="Thanks" onClick={onThanks}>
                    <img src={thanksSvg} className={classes.actionIcon} alt="thanks" />
                    <Typography variant="subtitle1" className={classes.buttonText}>
                      {thanksCount}
                    </Typography>
                  </Button>
                )}
                <Typography variant="subtitle1" className={classes.buttonText}>
                  <img src={commentSvg} className={classes.actionIcon} alt="comment" />
                  {questionsCount}
                </Typography>
              </>
            )}
          </div>
          <Typography variant="subtitle1" className={classes.buttonText}>
            {`${viewCount} views`}
          </Typography>
        </div>
      </>
    );
  }
}

export default withStyles(styles as any)(PostItemActions);
