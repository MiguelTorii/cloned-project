/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import Textarea from 'react-textarea-autosize';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EmojiSelector from '../EmojiSelector';

const styles = theme => ({
  root: {
    padding: '2px 4px',
    width: '95%',
    margin: '0 auto',
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.circleIn.palette.borderColor,
    backgroundColor: theme.circleIn.palette.appBar
  },
  form: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  textfield: {
    marginLeft: 8,
    flex: 1,
    padding: 0
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
  },
  imgContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

type Props = {
  classes: Object,
  expanded: Boolean,
  onSendMessage: Function,
  onSendInput: Function,
  onTyping: Function
};

type State = {
  message: string,
  addNextLine: boolean,
  image: ?Object,
  input: ?Object,
  isHover: boolean
};

class ChatTextField extends React.PureComponent<Props, State> {
  state = {
    message: '',
    addNextLine: false,
    image: null,
    input: null,
    isHover: false
  };

  handleSubmit = event => {
    event.preventDefault();
    const { onSendMessage, onSendInput } = this.props;
    const { message, input } = this.state;
    if (message.trim() !== '') {
      onSendMessage(message);
      this.setState({ message: '' });
    }

    if (input) {
      onSendInput(input);
      this.setState({ input: null, image: null, isHover: false });
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

  handleKeyDown = event => {
    const { addNextLine, input } = this.state;
    const { onSendInput } = this.props;
    if (event.keyCode === 13 && !addNextLine) {
      event.preventDefault();
      const { onSendMessage } = this.props;
      const { message } = this.state;
      if (message.trim() !== '') {
        onSendMessage(message);
        this.setState({ message: '' });
      }
      if (input) {
        onSendInput(input);
        this.setState({ input: null, image: null, isHover: false });
      }
    }
    if (event.keyCode === 16) {
      this.setState({ addNextLine: true });
    }
  };

  handleKeyUp = event => {
    if (event.keyCode === 16) {
      this.setState({ addNextLine: false });
    }
  };

  handleInputChange = () => {
    // const { onSendInput } = this.props;
    if (
      this.fileInput &&
      this.fileInput.files &&
      this.fileInput.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = event => {
        if (
          this.fileInput &&
          this.fileInput.files &&
          this.fileInput.files.length > 0
        ) {
          this.setState({
            image: event.target.result,
            input: this.fileInput.files[0]
          });
        }
        if (this.fileInput) {
          this.fileInput.value = '';
        }
      };

      reader.readAsDataURL(this.fileInput.files[0]);
    }
  };

  handleRemoveImg = () => {
    this.setState({ image: null, input: null, isHover: false });
  };

  handleMouseEnter = () => {
    this.setState({ isHover: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHover: false });
  };

  handleSelect = emoji => {
    this.setState(({ message }) => ({ message: `${message}${emoji}` }));
  };

  // eslint-disable-next-line no-undef
  fileInput: ?HTMLInputElement;

  render() {
    const { classes, expanded } = this.props;
    const { message, image, isHover } = this.state;

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              minHeight: 44
            }}
          >
            <InputBase
              value={message}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              className={classes.textfield}
              inputComponent={Textarea}
              inputProps={{ style: { maxHeight: expanded ? 200 : 100, paddingTop: 5 } }}
              multiline
              rowsMax={2}
              placeholder="Type a message"
              autoComplete="off"
              autoFocus
              endAdornment={
                image && (
                  <ButtonBase
                    className={classes.imgContainer}
                    onClick={this.handleRemoveImg}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                  >
                    <img className={classes.img} src={image} alt="test" />
                    {isHover && (
                      <div className={classes.clearIcon}>
                        <ClearIcon fontSize="small" />
                      </div>
                    )}
                  </ButtonBase>
                )
              }
            />
          </div>
          <EmojiSelector onSelect={this.handleSelect} />
          {(message || image) && <Divider light className={classes.divider} />}
          {(message || image) && <IconButton
            color="primary"
            type="submit"
            className={classes.iconButton}
            aria-label="Send"
          >
            <SendIcon />
          </IconButton>}
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(ChatTextField);
