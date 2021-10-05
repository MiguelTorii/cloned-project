/* eslint-disable react/no-danger */
// @flow
import React, { useRef, useCallback, useState } from 'react';
import Textarea from 'react-textarea-autosize';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import EmojiSelector from 'components/EmojiSelector/EmojiSelector';

const styles = (theme) => ({
  tooltip: {
    fontSize: 14
  },
  root: {
    display: 'flex',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing()
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.spacing(4),
    backgroundColor: theme.circleIn.palette.primaryBackground,
    marginLeft: 8
  },
  form: {
    display: 'flex',
    flex: 1
  },
  textfield: {
    width: '100%',
    flex: 1,
    paddingLeft: theme.spacing(2)
  },
  sendIcon: {
    color: theme.circleIn.palette.brand
  },
  imgIcon: {
    padding: 0
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
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
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    objectFit: 'scale-down',
    width: '60%',
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

type Props = {
  classes: Object,
  onSendMessage: Function,
  expanded: boolean,
  onSendInput: Function,
  onTyping: Function,
  message: string,
  setMessage: Function
};

const ChatTextField = ({
  classes,
  message,
  setMessage,
  onSendMessage,
  onSendInput,
  expanded,
  onTyping
}: Props) => {
  const [addNextLine, setAddNextLine] = useState(false);
  const [image, setImage] = useState(null);
  const [input, setInput] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const fileInput = useRef(null);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (input) {
        onSendInput(input);
        setInput(null);
        setImage(null);
        setIsHover(false);
      }

      if (message.trim() !== '') {
        onSendMessage(message);
        setMessage('');
      }
    },
    [input, message, onSendInput, onSendMessage, setMessage]
  );

  const handleChange = useCallback(
    (event) => {
      setMessage(event.target.value);
      onTyping();
    },
    [onTyping, setMessage]
  );

  const handleOpenInputFile = useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13 && !addNextLine) {
        event.preventDefault();
        if (message.trim() !== '') {
          onSendMessage(message);
          setMessage('');
        }
        if (input) {
          onSendInput(input);
          setInput(null);
          setImage(null);
          setIsHover(false);
        }
      }
      if (event.keyCode === 16) {
        setAddNextLine(true);
      }
    },
    [addNextLine, input, message, onSendInput, onSendMessage, setMessage]
  );

  const handleKeyUp = useCallback((event) => {
    if (event.keyCode === 16) {
      setAddNextLine(false);
    }
  }, []);

  const handleInputChange = useCallback(() => {
    if (fileInput.current && fileInput.current.files && fileInput.current.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (fileInput.current && fileInput.current.files && fileInput.current.files.length > 0) {
          setImage(event.target.result);
          setInput(fileInput.current.files[0]);
        }
        if (fileInput.current) {
          fileInput.current.value = '';
        }
      };

      reader.readAsDataURL(fileInput.current.files[0]);
    }
  }, []);

  const handleRemoveImg = useCallback(() => {
    setInput(null);
    setImage(null);
    setIsHover(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const handleSelect = useCallback(
    (emoji) => {
      setMessage(`${message}${emoji}`);
    },
    [message, setMessage]
  );

  return (
    <Paper className={classes.root} elevation={1}>
      <div className={classes.iconButton}>
        <IconButton
          className={classes.imgIcon}
          onClick={handleOpenInputFile}
          aria-label="Insert Photo"
        >
          <InsertPhotoIcon />
        </IconButton>
      </div>
      <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          <input
            accept="image/*"
            className={classes.input}
            ref={fileInput}
            onChange={handleInputChange}
            type="file"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              height: '100%',
              width: '100%',
              minHeight: 44
            }}
          >
            {image && (
              <ButtonBase
                className={classes.imgContainer}
                onClick={handleRemoveImg}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img className={classes.img} src={image} alt="test" />
                {isHover && (
                  <div className={classes.clearIcon}>
                    <ClearIcon fontSize="small" />
                  </div>
                )}
              </ButtonBase>
            )}
            <InputBase
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className={classes.textfield}
              inputComponent={Textarea}
              inputProps={{
                style: {
                  maxHeight: expanded ? 200 : 100,
                  paddingTop: 5,
                  width: '100%'
                }
              }}
              multiline
              rowsMax={2}
              placeholder="Type a message"
              autoComplete="off"
              autoFocus
            />
          </div>
          <EmojiSelector onSelect={handleSelect} />
        </div>
        {(message || image) && (
          <Tooltip
            arrow
            classes={{
              tooltip: classes.tooltip
            }}
            placement="top"
            title="Press enter to send"
          >
            <div className={classes.iconButton}>
              <IconButton
                color="primary"
                className={classes.imgIcon}
                type="submit"
                aria-label="Send"
              >
                <SendIcon
                  classes={{
                    root: classes.sendIcon
                  }}
                />
              </IconButton>
            </div>
          </Tooltip>
        )}
      </form>
    </Paper>
  );
};

export default withStyles(styles)(ChatTextField);
