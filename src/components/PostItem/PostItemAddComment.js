// @flow
import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
// import AnonymousButton from 'components/AnonymousButton';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography'
import RichTextEditor from '../../containers/RichTextEditor';

const MyLink = React.forwardRef(({ href, ...props }, ref) => <RouterLink to={href} {...props} />);

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
    maxWidth: 200,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600
    }
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
  userId: string,
  profileImageUrl: string,
  name: string,
  isReply: boolean,
  rte: boolean,
  readOnly: boolean,
  isQuestion: boolean,
  onPostComment: Function,
  onCancelComment: Function
};

const PostItemAddComment = ({
  isReply = false,
  rte = false,
  onCancelComment = () => {},
  classes,
  userId,
  profileImageUrl,
  name,
  readOnly,
  isQuestion,
  onPostComment,
}: Props) => {
  const [value, setValue] = useState('')
  // const [anonymousActive, setAnonymousActive] = useState(false)

  // const toggleAnonymousActive = useCallback(() => {
  // setAnonymousActive(a => !a)
  // }, [])

  const handleChange = useCallback(event => {
    setValue(event.target.value)
  }, [])

  const handleRTEChange = useCallback(value => {
    if (value.trim() === '<p><br></p>') setValue('')
    else setValue(value)
  }, [])

  const handleClick = useCallback(() => {
    onPostComment({
      comment: value,
      // anonymous: anonymousActive
    });
    setValue('')
    if (onCancelComment) onCancelComment();
  }, [onCancelComment, onPostComment, value])

  const handleCancel = useCallback(() => {
    setValue('')
    if (onCancelComment) onCancelComment();
  }, [onCancelComment])

  const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
  return (
    <div className={cx(classes.container, isReply && classes.reply)}>
      <div className={classes.body}>
        <Link
          // className={classes.avatar}
          component={MyLink}
          href={`/profile/${userId}`}
        >
          <Avatar src={profileImageUrl}>{initials}</Avatar>
        </Link>
        {rte && !readOnly ? (
          <RichTextEditor
            placeholder={
              isQuestion
                ? 'Have an answer or a comment? Enter it here'
                : 'Have a question or a comment? Enter it here'
            }
            value={value}
            onChange={handleRTEChange}
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
      <div className={classes.actions}>
        {/* <Typography variant="subtitle1">Comment Anonymously</Typography> */}
        {/* <AnonymousButton */}
        {/* active={anonymousActive} */}
        {/* toggleActive={toggleAnonymousActive} */}
        {/* /> */}
        <Button
          onClick={handleCancel}
          disabled={readOnly}
          color="secondary"
        // variant="contained"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={value.trim() === '' || readOnly}
          onClick={handleClick}
        >
          Comment
        </Button>
      </div>
    </div>
  );
}

export default withStyles(styles)(PostItemAddComment);
