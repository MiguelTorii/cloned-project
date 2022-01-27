import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './HudStoryStyles';
import avatarImg from '../../assets/svg/icon-kobe.svg';
import { HudStoryState } from '../storyState/hudStoryState';
import useStorySequence from '../storyState/useStorySequence';

const HudStory = () => {
  const classes: any = useStyles();

  const currentStatement: string = useSelector(
    (state: { hudStory: HudStoryState }) => state.hudStory.currentStatement
  );

  const { canUserCloseStory, closeStory } = useStorySequence();

  if (!currentStatement) {
    return null;
  }

  return (
    <div className={classes.storyContainer}>
      <div className={classes.storyAvatarContainer}>
        <div className={classes.storyAvatarBackground}>
          <img src={avatarImg} alt="story-avatar" className={classes.storyAvatar} />
        </div>
      </div>

      <div className={classes.storyMessageContainer}>
        <div className={classes.storyMessage}>
          {/** If this is ever used to display chat messages or other user based content, it should be updated to display a sanitized version of the message to prevent cross-site scripting attacks. */}
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: currentStatement }} />
        </div>
      </div>

      {canUserCloseStory() && <CloseIcon className={classes.closeIcon} onClick={closeStory} />}
    </div>
  );
};

export default HudStory;
