/* eslint-disable jsx-a11y/accessible-emoji */
import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import cx from 'classnames';
import { Picker } from 'emoji-mart';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { useDispatch } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { FILE_LIMIT_SIZE } from 'constants/chat';
import type { ChatUpload } from 'utils/chat';
import { isMac } from 'utils/helpers';

import { showNotification } from 'actions/notifications';
import { uploadMedia } from 'actions/user';
import AttachFile from 'components/FileUpload/AttachFile';
import { useChatQuill } from 'features/chat';

import styles from './_styles/messageQuill';
import EditorToolbar, { formats } from './Toolbar';

export type MessageQuillProps = {
  classes?: any;
  onSendMessage: (message: string) => void;
  showError?: boolean;
  onTyping: () => Promise<void> | void;
  userId?: any;
  files: ChatUpload[];
  setFiles: Dispatch<SetStateAction<ChatUpload[]>>;
  isNamedChannel?: boolean;
};

const MessageQuill = ({
  classes,
  files,
  isNamedChannel,
  onSendMessage,
  onTyping,
  setFiles,
  showError,
  userId
}: MessageQuillProps) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');

  const onChange = useCallback((updatedValue: string) => {
    if (updatedValue.trim() === '<p><br></p>' || updatedValue.trim() === '<p>\n</p>') {
      setValue('');
    } else {
      const currentValue = updatedValue.replaceAll('<p><br></p>', '').replaceAll('<p>\n</p>', '');
      setValue(currentValue);
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [isPressEnter, setPressEnter] = useState(false);
  const [emojiPopupOpen, setEmojiPopupOpen] = useState(false);
  const inputFieldRef = useRef();
  const bindings = useMemo(
    () => ({
      enter: {
        key: 'enter',
        handler: () => {
          setPressEnter(true);
          return false;
        }
      },
      emoji: {
        key: 'J',
        shortKey: true,
        altKey: !isMac(),
        handler: () => {
          setEmojiPopupOpen(true);
          return true;
        }
      }
    }),
    []
  );
  const uploadFile = useCallback(
    async (file) => {
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
    },
    [dispatch, files, setFiles, userId]
  );
  const imageHandler = useCallback(
    async (imageDataUrl, type, imageData) => {
      setLoading(true);

      try {
        const filename = [
          'image',
          '-',
          Math.floor(Math.random() * 1e12),
          '-',
          new Date().getTime(),
          '.',
          type.match(/^image\/(\w+)$/i)[1]
        ].join('');
        const file = imageData.toFile(filename);
        await uploadFile(file);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    },
    [userId]
  );
  const handleCloseEmojiPopup = useCallback(() => {
    setEmojiPopupOpen(false);
  }, []);

  const { quill, quillRef, Quill } = useChatQuill(
    'message-toolbar',
    {
      modules: {
        toolbar: '#message-toolbar',
        keyboard: {
          bindings
        },
        imageDropAndPaste: {
          handler: imageHandler
        }
      },
      scrollingContainer: 'editor',
      formats,
      placeholder: isNamedChannel ? 'Send a message to channel' : 'Send a message'
    },
    onChange,
    onTyping
  );

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

  useEffect(() => {
    if (quill) {
      quill.focus();
    }
  }, [quill]);

  useEffect(() => {
    async function sendMessage() {
      if (
        files.length === 0 &&
        (value.trim() === '<p><br></p>' ||
          !value ||
          value.replaceAll('<p>', '').replaceAll('</p>', '').trim() === '')
      ) {
        setValue('');
        setPressEnter(false);
      } else {
        await onSendMessage(value.replaceAll('<p><br></p>', ''));
        setValue('');
        setPressEnter(false);
        quill.setText('');
      }
    }

    if (isPressEnter) {
      sendMessage();
    } // eslint-disable-next-line
  }, [isPressEnter]);
  const insertEmoji = useCallback(
    (emoji) => {
      if (quill) {
        const cursorPosition = quill.getSelection(true).index;
        quill.insertText(cursorPosition, `${emoji}`);
        quill.setSelection(cursorPosition + 2, null);
        const currentContent = quill.root.innerHTML;
        setValue(currentContent);
      }
    },
    [quill, setValue]
  );
  const handleSelectEmoji = useCallback(
    (emoji) => {
      const { native } = emoji;
      insertEmoji(native);
      setEmojiPopupOpen(false);
    },
    [insertEmoji]
  );
  const handleUploadFile = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = async () => {
      setLoading(true);

      try {
        const file = input.files[0];
        await uploadFile(file);
      } catch (error) {
        quill.enable(true);
      } finally {
        setLoading(false);
      }
    };
  }, [quill, files]);
  const onClose = useCallback(
    (deleteFile) => {
      const filterFiles = files.filter((file) => file.url !== deleteFile.url);
      setFiles(filterFiles);
    },
    [files]
  );
  return (
    <div className={classes.messageQuill}>
      <div
        className={cx(files.length > 0 ? classes.editWithFile : classes.editor)}
        ref={inputFieldRef}
      >
        <div className={classes.innerContainerEditor}>
          <div className={classes.editorToolbar}>
            <div id="editor" className={classes.editorable} ref={quillRef} />
            <EditorToolbar
              id="message-toolbar"
              handleSelect={insertEmoji}
              handleUploadFile={handleUploadFile}
            />
          </div>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
      <Popover
        open={emojiPopupOpen}
        onClose={handleCloseEmojiPopup}
        anchorEl={inputFieldRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        getContentAnchorEl={null}
      >
        <Picker onSelect={handleSelectEmoji} />
      </Popover>
      {files.length > 0 && (
        <div className={classes.files}>
          {files.map((file) => (
            <AttachFile key={file.url} file={file} onClose={() => onClose(file)} smallChat />
          ))}
        </div>
      )}

      <div className={cx(showError ? classes.error : classes.nonError)}>
        <Typography component="p" variant="subtitle1" className={classes.errorMessage}>
          {"We couldn't send your message for some reason. 😥"}
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(MessageQuill);
