/* eslint-disable react/no-danger */
import React, { useRef, useCallback, useState } from 'react';
import Textarea from 'react-textarea-autosize';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ButtonBase from '@material-ui/core/ButtonBase';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import EmojiSelector from '../../components/EmojiSelector/EmojiSelector';
import AttachFile from '../../components/FileUpload/AttachFile';
import { ReactComponent as PaperClip } from '../../assets/svg/quill-paper.svg';
import { FILE_LIMIT_SIZE } from '../../constants/chat';
import { uploadMedia } from '../../actions/user';

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
  },
  tooltip: {
    fontSize: 14,
    backgroundColor: theme.circleIn.palette.tooltipBackground
  },
  tooltipArrow: {
    '&::before': {
      backgroundColor: theme.circleIn.palette.tooltipBackground
    }
  },
  popper: {
    zIndex: 1500,
    width: 123,
    textAlign: 'center'
  }
});

type Props = {
  classes?: Record<string, any>;
  onSendMessage?: (...args: Array<any>) => any;
  expanded?: boolean;
  onSendInput?: (...args: Array<any>) => any;
  onTyping?: (...args: Array<any>) => any;
  showNotification?: (...args: Array<any>) => any;
  userId?: string;
  message?: string;
  input?: Record<string, any>;
  image?: Record<string, any>;
  setInput?: (...args: Array<any>) => any;
  setMessage?: (...args: Array<any>) => any;
  files?: Array<any>;
  setFiles?: (...args: Array<any>) => any;
  onClose?: (...args: Array<any>) => any;
};

const ChatTextField = ({
  classes,
  message,
  setMessage,
  onSendMessage,
  onSendInput,
  showNotification,
  input,
  userId,
  setInput,
  expanded,
  onTyping,
  files,
  setFiles,
  onClose
}: Props) => {
  const [addNextLine, setAddNextLine] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const fileInput = useRef(null);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (input && !files.length) {
        onSendInput(input);
        setInput(null);
        setIsHover(false);
        setInput(null);
      }

      if (message.trim() !== '' || !!files.length) {
        onSendMessage(message, files);
        setMessage('');
        setFiles([]);
      }
    },
    [input, message, onSendInput, onSendMessage, setInput, setMessage, files, setFiles]
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

        if (input || !!files.length) {
          setInput(null);
          setIsHover(false);
          onSendInput(input);
          setInput(null);
          setFiles([]);
        }
      }

      if (event.keyCode === 16) {
        setAddNextLine(true);
      }
    },
    [addNextLine, input, message, onSendInput, onSendMessage, setInput, setMessage, files]
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
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);
  const handleRemoveImg = useCallback(() => {
    setInput(null);
    setIsHover(false);
  }, [setInput]);
  const handleInputChange = useCallback(async () => {
    const file = fileInput.current.files[0];
    const { type, name, size } = file;

    if (size < FILE_LIMIT_SIZE) {
      const result = await uploadMedia(userId, 1, file);
      const { readUrl } = result;
      const anyFile = {
        type,
        name,
        url: readUrl,
        size
      };
      setFiles([...files, anyFile]);
    } else {
      showNotification({
        message: 'Upload File size is over 40 MB',
        variant: 'warning'
      });
    }
  }, [userId, fileInput, showNotification, files]);
  const checkDisabled = useCallback(() => {
    if (files.length > 0) {
      return false;
    }

    if (!message && !input) {
      return true;
    }

    return false;
  }, [files, message, input]);
  return (
    <Paper className={classes.root} elevation={1}>
      <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
        <div className={cx(files.length > 0 ? classes.fileInputContainer : classes.inputContainer)}>
          <input
            accept="*/*"
            className={classes.input}
            ref={fileInput}
            onChange={handleInputChange}
            type="file"
          />
          <Tooltip
            title="Upload File (max limit: 40 MB)"
            aria-label="file"
            arrow
            placement="top"
            classes={{
              tooltip: classes.tooltip,
              arrow: classes.tooltipArrow,
              popper: classes.popper
            }}
          >
            <IconButton
              className={classes.imgIcon}
              onClick={handleOpenInputFile}
              aria-label="Upload File"
            >
              <PaperClip />
            </IconButton>
          </Tooltip>
          <div className={classes.inputWrapper}>
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
                root: checkDisabled() ? classes.sendIconDisabled : classes.sendIcon
              }}
            />
          </IconButton>
        </div>
      </form>
      {files.length > 0 && (
        <div className={classes.files}>
          {files.map((file) => (
            <AttachFile key={file.url} smallChat file={file} onClose={() => onClose(file)} />
          ))}
        </div>
      )}
    </Paper>
  );
};

export default withStyles(styles as any)(ChatTextField);
