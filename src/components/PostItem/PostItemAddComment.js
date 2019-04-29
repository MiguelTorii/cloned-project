// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  reply: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 4
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing.unit * 2
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
  isReply?: boolean,
  onPostComment: Function,
  onCancelComment?: Function
};

type State = {};

class PostItemAddComment extends React.PureComponent<Props, State> {
  static defaultProps = {
    isReply: false,
    onCancelComment: () => {}
  };

  state = {
    value: ''
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleClick = () => {
    const { onPostComment, onCancelComment } = this.props;
    const { value } = this.state;
    onPostComment({ comment: value });
    this.setState({ value: '' });
    onCancelComment();
  };

  handleCancel = () => {
    this.setState({ value: '' });
    const { onCancelComment } = this.props;
    onCancelComment();
  };

  render() {
    const { classes, isReply } = this.props;
    const { value } = this.state;

    return (
      <div className={cx(classes.container, isReply && classes.reply)}>
        <div className={classes.body}>
          <Avatar>CR</Avatar>
          <TextField
            id="outlined-bare"
            placeholder="Have a question? Ask here"
            value={value}
            margin="normal"
            variant="outlined"
            className={classes.textField}
            fullWidth
            onChange={this.handleChange}
          />
        </div>
        <div className={classes.actions}>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            disabled={value.trim() === ''}
            onClick={this.handleClick}
          >
            Reply
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PostItemAddComment);
