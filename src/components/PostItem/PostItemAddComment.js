// @flow
import React from 'react';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import RichTextEditor from '../../containers/RichTextEditor';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

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
  isReply?: boolean,
  rte?: boolean,
  readOnly: boolean,
  isQuestion: boolean,
  onPostComment: Function,
  onCancelComment?: Function
};

type State = {
  value: string
};

class PostItemAddComment extends React.PureComponent<Props, State> {
  static defaultProps = {
    isReply: false,
    rte: false,
    onCancelComment: () => {}
  };

  state = {
    value: ''
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleRTEChange = value => {
    if (value.trim() === '<p><br></p>') this.setState({ value: '' });
    else this.setState({ value });
  };

  handleClick = () => {
    const { onPostComment, onCancelComment } = this.props;
    const { value } = this.state;
    onPostComment({ comment: value });
    this.setState({ value: '' });
    if (onCancelComment) onCancelComment();
  };

  handleCancel = () => {
    this.setState({ value: '' });
    const { onCancelComment } = this.props;
    if (onCancelComment) onCancelComment();
  };

  render() {
    const {
      classes,
      userId,
      rte,
      profileImageUrl,
      name,
      isReply,
      readOnly,
      isQuestion
    } = this.props;
    const { value } = this.state;
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
                  ? 'Know the answer? Reply here'
                  : 'Have a question? Ask here'
              }
              value={value}
              onChange={this.handleRTEChange}
            />
          ) : (
            <TextField
              id="outlined-bare"
              placeholder={
                isQuestion
                  ? 'Know the answer? Reply here'
                  : 'Have a question? Ask here'
              }
              value={value}
              margin="normal"
              variant="outlined"
              className={classes.textField}
              fullWidth
              disabled={readOnly}
              onChange={this.handleChange}
            />
          )}
        </div>
        <div className={classes.actions}>
          <Button
            onClick={this.handleCancel}
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
            onClick={this.handleClick}
          >
            Comment
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PostItemAddComment);
