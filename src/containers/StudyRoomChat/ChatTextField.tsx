/* eslint-disable react/no-danger */
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import cx from 'classnames';
import Textarea from 'react-textarea-autosize';

import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';

import { FILE_LIMIT_SIZE } from 'constants/chat';
import type { ChatUpload } from 'utils/chat';

import { showNotification } from 'actions/notifications';
import { uploadMedia } from 'actions/user';
import { ReactComponent as PaperClip } from 'assets/svg/quill-paper.svg';
import EmojiSelector from 'components/EmojiSelector/EmojiSelector';
import AttachFile from 'components/FileUpload/AttachFile';
import { useAppDispatch, useAppSelector } from 'redux/store';

const useStyles = makeStyles((theme) => ({
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
}));

export type ChatTextFieldProps = {
  onSendMessage: (message: string, files: ChatUpload[]) => void;
  expanded?: boolean;
  onTyping: () => Promise<void>;
  image?: Record<string, any>;
  files: ChatUpload[];
  setFiles: Dispatch<SetStateAction<ChatUpload[]>>;
  onClose: (file: ChatUpload) => void;
};

const ChatTextField = ({
  onSendMessage,
  expanded,
  onTyping,
  files,
  setFiles,
  onClose
}: ChatTextFieldProps) => {
  const userId = useAppSelector((state) => state.user.data.userId);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [addNextLine, setAddNextLine] = useState(false);
  const fileInput = useRef(null);
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (message.trim() !== '' || !!files.length) {
        onSendMessage(message, files);
        setMessage('');
        setFiles([]);
      }
    },
    [message, onSendMessage, setMessage, files, setFiles]
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

        if (files.length) {
          setFiles([]);
        }
      }

      if (event.keyCode === 16) {
        setAddNextLine(true);
      }
    },
    [addNextLine, files, message, onSendMessage, setFiles]
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

  const handleInputChange = useCallback(async () => {
    const file = fileInput.current.files[0];
    const { type, name, size } = file;

    if (size < FILE_LIMIT_SIZE) {
      const result = await uploadMedia(userId, 1, file);
      const { readUrl } = result;
      const anyFile: ChatUpload = {
        type,
        name,
        url: readUrl,
        size
      };
      setFiles([...files, anyFile]);
    } else {
      dispatch(
        showNotification({
          message: 'Upload File size is over 40 MB',
          variant: 'warning'
        })
      );
    }
  }, [dispatch, files, setFiles, userId]);

  const checkDisabled = useCallback(() => {
    if (files.length > 0) {
      return false;
    }

    if (!message) {
      return true;
    }

    return false;
  }, [files, message]);

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

export default ChatTextField;
