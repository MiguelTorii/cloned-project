/* eslint-disable react/sort-comp */

/* eslint-disable react/no-danger */
import React, { useState } from 'react';

import Textarea from 'react-textarea-autosize';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';

import { FILE_LIMIT_SIZE } from 'constants/chat';

import { showNotification } from 'actions/notifications';
import { uploadMedia } from 'actions/user';
import { ReactComponent as PaperClip } from 'assets/svg/quill-paper.svg';

import styles from '../_styles/FloatingChat/ChatTextField';
import EmojiSelector from '../EmojiSelector/EmojiSelector';
import AttachFile from '../FileUpload/AttachFile';

type Props = {
  classes?: Record<string, any>;
  expanded?: boolean;
  hideImage?: boolean;
  onSendMessage?: (...args: Array<any>) => any;
  onSendInput?: (...args: Array<any>) => any;
  onTyping?: (...args: Array<any>) => any;
  userId?: string;
};

type ChatTexFieldFile = {
  type: string;
  name: string;
  url: string;
  size: number;
};

const ChatTextField = ({
  classes,
  expanded,
  hideImage,
  onSendMessage,
  onSendInput,
  onTyping,
  userId
}: Props) => {
  const [message, setMessage] = useState<string>('');
  const [addNextLine, setAddNextLine] = useState<boolean>(false);
  const [input, setInput] = useState<Record<string, any> | null | undefined>(null);
  const [files, setFiles] = useState<ChatTexFieldFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '' || !!files.length) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }

    if (input && !files.length) {
      onSendInput(input);
      setInput(null);
      setFiles([]);
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    onTyping();
  };

  const handleOpenInputFile = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && (files.length > 0 || !addNextLine)) {
      event.preventDefault();

      if (message.trim() !== '' || !!files.length) {
        onSendMessage(message, files);
        setMessage('');
        setFiles([]);
      }

      if (input && !files.length) {
        onSendInput(input);
        setMessage('');
        setFiles([]);
      }
    }

    if (event.keyCode === 16) {
      setAddNextLine(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 16) {
      setAddNextLine(false);
    }
  };

  const handleInputChange = async () => {
    const file = fileInput.files[0];
    const { type, name, size } = file;

    if (size < FILE_LIMIT_SIZE) {
      setLoading(true);
      const result = await uploadMedia(userId, 1, file);
      const { readUrl } = result;
      const anyFile = {
        type,
        name,
        url: readUrl,
        size
      };
      setFiles([...files, anyFile]);
      setLoading(false);
    } else {
      showNotification({
        message: 'Upload File size is over 40 MB',
        variant: 'warning'
      });
    }
  };

  const handleSelect = (emoji) => {
    setMessage(`${message}${emoji}`);
  };

  const onClose = (deleteFile) => {
    const filterFiles = files.filter((file) => file.url !== deleteFile.url);
    setFiles(filterFiles);
  };

  return (
    <Paper className={classes.root} elevation={1}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
          {!hideImage && (
            <IconButton
              onClick={handleOpenInputFile}
              className={classes.iconButton}
              aria-label="Insert Photo"
            >
              <PaperClip />
            </IconButton>
          )}
          <input
            accept="*/*"
            className={classes.input}
            ref={(fileInput) => {
              setFileInput(fileInput);
            }}
            onChange={handleInputChange}
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
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className={classes.textfield}
              inputComponent={Textarea}
              inputProps={{
                style: {
                  maxHeight: expanded ? 200 : 100,
                  paddingTop: 5
                }
              }}
              multiline
              rowsMax={2}
              placeholder="Type a message"
              autoComplete="off"
              autoFocus
            />
          </div>
          <EmojiSelector onSelect={handleSelect} isFloatChat />
          {message && <Divider light className={classes.divider} />}
          {message && (
            <Tooltip
              arrow
              classes={{
                tooltip: classes.tooltip
              }}
              placement="top"
              title="Press enter to send"
            >
              <IconButton
                color="primary"
                type="submit"
                className={classes.iconButton}
                aria-label="Send"
              >
                <SendIcon className={classes.sendMessageIcon} />
              </IconButton>
            </Tooltip>
          )}
        </form>
      )}
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
