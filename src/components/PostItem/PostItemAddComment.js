// @flow
import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CommentQuill from './CommentQuill'
import SkeletonLoad from './SkeletonLoad';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2)
  },
  reply: {
    marginTop: theme.spacing(),
    marginLeft: theme.spacing(4)
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: 120
  },
  textField: {
    marginLeft: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

type Props = {
  classes: Object,
  feedId: string,
  userId: string,
  isReply: boolean,
  rte: boolean,
  readOnly: boolean,
  isQuestion: boolean,
  onPostComment: Function,
  onCancelComment: Function
};

const PostItemAddComment = ({
  commentId,
  isReply = false,
  rte = false,
  onCancelComment = () => {},
  classes,
  readOnly,
  isQuestion,
  onPostComment,
  feedId,
  userId
}: Props) => {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = useCallback(event => {
    setValue(event.target.value)
  }, [])

  const handleRTEChange = useCallback(updatedValue => {
    if (updatedValue.trim() === '<p><br></p>') setValue('')
    else setValue(updatedValue)
  }, [])

  const handleClick = useCallback((quill) => async () => {
    setIsLoading(true)
    if (value.trim() === '' || !value) {
      setShowError(true)
    } else {
      await onPostComment({ comment: value });
      setValue('')
      if (quill) {
        quill.setText('')
      }
      if (onCancelComment) onCancelComment()
    }
    setIsLoading(false)
  }, [onCancelComment, onPostComment, value])

  return (
    <div className={cx(classes.container, isReply && classes.reply)}>
      <div className={classes.body}>

        {rte && !readOnly ? (
          <CommentQuill
            value={value}
            userId={userId}
            onChange={handleRTEChange}
            feedId={isReply ? commentId : feedId}
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
}

export default withStyles(styles)(PostItemAddComment);
