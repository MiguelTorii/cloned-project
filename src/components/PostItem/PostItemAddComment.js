// @flow
import React, { useState, useCallback, useEffect } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CommentQuill from './CommentQuill';
import SkeletonLoad from './SkeletonLoad';

import styles from '../_styles/PostItem/PostItemAddComment';

type Props = {
  classes: Object,
  feedId: string,
  userId: string,
  isPastClassFlashcard: boolean,
  isReply: boolean,
  rte: boolean,
  readOnly: boolean,
  isQuestion: boolean,
  defaultValue: string,
  toolbarPrefix: string,
  onPostComment: Function,
  onCancelComment: Function,
  onEscape: Function
};

const PostItemAddComment = ({
  commentId,
  isReply = false,
  rte = false,
  isPastClassFlashcard,
  onCancelComment = () => {},
  classes,
  readOnly,
  isQuestion,
  onPostComment,
  onEscape = () => {},
  feedId,
  userId,
  toolbarPrefix,
  defaultValue
}: Props) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const handleRTEChange = useCallback((updatedValue) => {
    if (updatedValue.trim() === '<p><br></p>') {
      setValue('');
    } else {
      setValue(updatedValue);
    }
  }, []);

  const handleClick = useCallback(
    (quill) => async () => {
      setIsLoading(true);
      if (value.trim() === '' || !value) {
        setShowError(true);
      } else {
        await onPostComment({ comment: value });
        setValue('');
        if (quill) {
          quill.setText('');
        }
        if (onCancelComment) {
          onCancelComment();
        }
      }
      setIsLoading(false);
    },
    [onCancelComment, onPostComment, value]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    },
    [onEscape]
  );

  return (
    <div className={cx(classes.container, isReply && classes.reply)}>
      <div aria-hidden="true" className={classes.body} onKeyUp={handleKeyUp}>
        {rte && !readOnly ? (
          <CommentQuill
            value={value}
            isPastClassFlashcard={isPastClassFlashcard}
            userId={userId}
            onChange={handleRTEChange}
            feedId={isReply ? commentId : feedId}
            toolbarPrefix={toolbarPrefix}
            setValue={setValue}
            handleClick={handleClick}
            showError={showError}
          />
        ) : (
          <TextField
            id="outlined-bare"
            placeholder={
              isQuestion
                ? 'Have an answer or a comment? Enter it here'
                : 'Have a question or a comment? Enter it here'
            }
            value={value}
            margin="normal"
            variant="outlined"
            className={classes.textField}
            fullWidth
            disabled={readOnly}
            onChange={handleChange}
          />
        )}
      </div>
      {isLoading && <SkeletonLoad />}
    </div>
  );
};

export default withStyles(styles)(PostItemAddComment);
