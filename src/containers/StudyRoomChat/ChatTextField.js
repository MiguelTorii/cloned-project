/* eslint-disable react/no-danger */
// @flow
import React, { useRef, useCallback, useState } from 'react';
import Textarea from 'react-textarea-autosize';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import EmojiSelector from 'components/EmojiSelector';
import ButtonBase from '@material-ui/core/ButtonBase';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ClearIcon from '@material-ui/icons/Clear';
import AttachFile from 'components/FileUpload/AttachFile';

const styles = (theme) => ({
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
  tooltip: {
    fontSize: 14
  },
  root: {
    display: 'flex',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: '100%',
    borderRadius: 20,
    flexDirection: 'column'
  },
  inputContainer: {
    display: 'flex',
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    marginLeft: 8
  },
  form: {
    flex: 1,
    display: 'flex'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    minHeight: 44
  },
  fileInputContainer: {
    display: 'flex',
    borderRadius: theme.spacing(2.5, 2.5, 0, 0),
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    marginLeft: 8
  },
  textfield: {
    width: '100%',
    height: 'auto',
    backgroundColor: theme.circleIn.palette.hoverMenu,
    paddingLeft: theme.spacing(),
    borderRadius: 10
  },
  sendIcon: {
    color: theme.circleIn.palette.brand
  },
  sendIconDisabled: {
    color: theme.circleIn.palette.hoverMenu
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: 10
  },
  icon: {
    transform: 'rotate(-34.35deg)',
    padding: 0
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
  },
  files: {
    width: 358,
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    background: theme.circleIn.palette.hoverMenu,
    borderRadius: theme.spacing(0, 0, 2.5, 2.5),
    display: 'flex',
    flexWrap: 'wrap'
  }
});

type Props = {
  classes: Object,
  onSendMessage: Function,
  expanded: boolean,
  onSendInput: Function,
  onTyping: Function,
  message: string,
  setMessage: Function,
  files: Array,
  setFiles: Function,
  onClose: Function
};

const ChatTextField = ({
  classes,
  message,
  setMessage,
  onSendMessage,
  onSendInput,
  input,
  setInput,
  expanded,
  onTyping,
  files,
  setFiles,
  onClose
}: Props) => {
  const [addNextLine, setAddNextLine] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [image, setImage] = useState(null);
  const fileInput = useRef(null);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (input && !files.length) {
        onSendInput(input);
        setInput(null);
        setImage(null);
        setIsHover(false);
        setInput(null);
      }

      if (message.trim() !== '' || !!files.length) {
        onSendMessage(message, files);
        setMessage('');
        setFiles([]);
      }
    },
    [
      input,
      message,
      onSendInput,
      onSendMessage,
      setInput,
      setMessage,
      files,
      setFiles
    ]
  );

  const handleChange = useCallback(
    (event) => {
      setMessage(event.target.value);
      onTyping();
    },
    [onTyping, setMessage]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13 && !addNextLine) {
        event.preventDefault();
        if (message.trim() !== '' || !!files.length) {
          onSendMessage(message, files);
          setMessage('');
          setFiles([]);
        }
        if (input) {
          setInput(null);
          setImage(null);
          setIsHover(false);
          onSendInput(input);
          setInput(null);
        }
      }
      if (event.keyCode === 16) {
        setAddNextLine(true);
      }
    },
    [
      addNextLine,
      input,
      message,
      onSendInput,
      onSendMessage,
      setInput,
      setMessage,
      files
    ]
  );

  const handleKeyUp = useCallback((event) => {
    if (event.keyCode === 16) {
      setAddNextLine(false);
    }
  }, []);

  const handleSelect = useCallback(
    (emoji) => {
      setMessage(`${message}${emoji}`);
    },
    [message, setMessage]
  );

  const handleOpenInputFile = useCallback(() => {
    if (fileInput.current) fileInput.current.click();
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const handleRemoveImg = useCallback(() => {
    setInput(null);
    setImage(null);
    setIsHover(false);
  }, [setInput]);

  const handleInputChange = useCallback(() => {
    if (
      fileInput.current &&
      fileInput.current.files &&
      fileInput.current.files.length > 0
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (
          fileInput.current &&
          fileInput.current.files &&
          fileInput.current.files.length > 0
        ) {
          setImage(event.target.result);
          setInput(fileInput.current.files[0]);
        }
        if (fileInput.current) {
          fileInput.current.value = '';
        }
      };

      reader.readAsDataURL(fileInput.current.files[0]);
    }
  }, [setInput]);

  const checkDisabled = useCallback(() => {
    if (files.length > 0) return false;
    if (!message && !input) return true;
    return false;
  }, [files, message, input]);

  return (
    <Paper className={classes.root} elevation={1}>
      <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
        <div
          className={cx(
            files.length > 0
              ? classes.fileInputContainer
              : classes.inputContainer
          )}
        >
          <input
            accept="image/*"
            className={classes.input}
            ref={fileInput}
            onChange={handleInputChange}
            type="file"
          />
          <IconButton
            className={classes.imgIcon}
            onClick={handleOpenInputFile}
            aria-label="Insert Photo"
          >
            <InsertPhotoIcon />
          </IconButton>
          <div className={classes.inputWrapper}>
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
                  maxHeight: expanded ? 200 : 40,
                  paddingTop: 5,
                  width: '100%',
                  height: 'auto'
                }
              }}
              multiline
              rowsMax={2}
              placeholder="Write a message ..."
              autoComplete="off"
              autoFocus
            />
          </div>
          <EmojiSelector onSelect={handleSelect} />
        </div>
        <div className={classes.iconButton}>
          <IconButton
            disabled={checkDisabled()}
            className={classes.icon}
            type="submit"
            aria-label="Send"
          >
            <SendIcon
              classes={{
                root: checkDisabled()
                  ? classes.sendIconDisabled
                  : classes.sendIcon
              }}
            />
          </IconButton>
        </div>
      </form>
      {files.length > 0 && (
        <div className={classes.files}>
          {files.map((file) => (
            <AttachFile smallChat file={file} onClose={() => onClose(file)} />
          ))}
        </div>
      )}
    </Paper>
  );
};

export default withStyles(styles)(ChatTextField);
