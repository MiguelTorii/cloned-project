import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import cx from 'classnames';
import { useStyles } from './HudStoryStyles';
import avatarImg from '../../assets/svg/icon-kobe.svg';
import { HudStoryState } from '../storyState/hudStoryState';
import useStorySequence from '../storyState/useStorySequence';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const HudStory = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  const isStoryInProgress: boolean = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.isStoryInProgress
  );

  const { closeStory } = useStorySequence();

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  const canClose = !highlightedNavigation && !isStoryInProgress;

  if (!currentStatement) {
    return null;
  }

  return (
    <div className={classes.storyContainer}>
      <div className={classes.storyMessageBackground} />

      <div
        className={cx(
          classes.storyAvatarContainer,
          !!highlightedNavigation && classes.storyAvatarContainerHighlightingNavigation
        )}
      >
        <div className={classes.storyAvatarBackground}>
          <img src={avatarImg} alt="story-avatar" className={classes.storyAvatar} />
        </div>
      </div>

      <div className={classes.storyMessageContainer}>
        <div className={classes.storyMessage}>
          <Typography variant="body1">{currentStatement}</Typography>
        </div>
      </div>

      {canClose && <CloseIcon className={classes.closeIcon} onClick={closeStory} />}
    </div>
  );
};

export default HudStory;
