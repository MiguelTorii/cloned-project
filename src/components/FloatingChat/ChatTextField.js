/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import SendIcon from '@material-ui/icons/Send';

const styles = theme => ({
  root: {
    padding: '2px 4px',
    width: '95%',
    margin: '0 auto',
    marginTop: theme.spacing.unit,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.circleIn.palette.borderColor,
    backgroundColor: theme.circleIn.palette.appBar
  },
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  textfield: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  input: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  onSendMessage: Function,
  onSendInput: Function,
  onTyping: Function
};

type State = {
  message: string
};

class ChatTextField extends React.PureComponent<Props, State> {
  state = {
    message: ''
  };

  handleSubmit = event => {
    event.preventDefault();
    const { onSendMessage } = this.props;
    const { message } = this.state;
    if (message.trim() !== '') {
      onSendMessage(message);
      this.setState({ message: '' });
    }
  };

  handleChange = event => {
    const { onTyping } = this.props;
    this.setState({ message: event.target.value });
    onTyping();
  };

  handleOpenInputFile = () => {
    if (this.fileInput) this.fileInput.click();
  };

  handleInputChange = () => {
    const { onSendInput } = this.props;
    if (
      this.fileInput &&
      this.fileInput.files &&
      this.fileInput.files.length > 0
    )
      onSendInput(this.fileInput.files[0]);
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const { classes } = this.props;
    const { message } = this.state;
    return (
      <Paper className={classes.root} elevation={1}>
        <form
          autoComplete="off"
          className={classes.form}
          onSubmit={this.handleSubmit}
        >
          <IconButton
            onClick={this.handleOpenInputFile}
            className={classes.iconButton}
            aria-label="Insert Photo"
          >
            <InsertPhotoIcon />
          </IconButton>
          <input
            accept="image/*"
            className={classes.input}
            ref={fileInput => {
              this.fileInput = fileInput;
            }}
            onChange={this.handleInputChange}
            type="file"
          />
          <InputBase
            value={message}
            onChange={this.handleChange}
            className={classes.textfield}
            placeholder="Type a message"
          />
          <Divider light className={classes.divider} />
          <IconButton
            color="primary"
            type="submit"
            className={classes.iconButton}
            aria-label="Send"
          >
            <SendIcon />
          </IconButton>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(ChatTextField);
