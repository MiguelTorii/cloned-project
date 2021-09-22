/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useQuill } from 'react-quilljs';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { Picker } from 'emoji-mart';

import AttachFile from 'components/FileUpload/AttachFile';
import { FILE_LIMIT_SIZE } from 'constants/chat';
import { uploadMedia } from 'actions/user';
import EditorToolbar, { formats } from './Toolbar';

import styles from './_styles/messageQuill';

const MessageQuill = ({
  classes,
  onChange,
  value,
  setValue,
  onSendMessage,
  focusMessageBox,
  getFullName,
  showError,
  onTyping,
  userId,
  showNotification,
  setFiles,
  files,
  isCommunityChat
}) => {
  const [loading, setLoading] = useState(false);
  const [isPressEnter, setPressEnter] = useState(false);
  const [emojiPopupOpen, setEmojiPopupOpen] = useState(false);
  const inputFieldRef = useRef();

  const userName = getFullName(userId);
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
        handler: () => {
          setEmojiPopupOpen(true);
          return true;
        }
      }
    }),
    []
  );

  const uploadFile = useCallback(async (file) => {
    const { type, name, size } = file;
    console.log(file);
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
  }, [setFiles, showNotification, classes, files]);

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

  const { quill, quillRef, Quill } = useQuill({
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
    placeholder: isCommunityChat
      ? 'Send a message to channel'
      : 'Send a message',
    preserveWhitespace: true
  });

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

  useEffect(() => {
    if (quill) quill.focus();
  }, [focusMessageBox, quill]);

  useEffect(() => {
    if (quill) {
      quill.focus();
      quill.on('text-change', () => {
        if (quill.getSelection(true)) {
          onChange(quill.container.firstChild.innerHTML);
          if (
            quill.container.firstChild.innerHTML.length >
            quill.getSelection(true).index
          ) {
            quill.setSelection(
              quill.getSelection(true).index +
                quill.container.firstChild.innerHTML.length
            );
          }
          const currentFocusPosition = quill.getSelection(true).index;
          const leftPosition = quill.getBounds(currentFocusPosition).left;
          const currentTooltipWidth = document.getElementById('message-toolbar')
            ? document.getElementById('message-toolbar').clientWidth
            : 0;
          const currentEditorWidth = quill.container.firstChild.clientWidth;
          if (currentEditorWidth - currentTooltipWidth < leftPosition + 80) {
            if (!quill.container.firstChild.innerHTML.includes('<p>\n</p>')) {
              quill.insertText(
                quill.container.firstChild.innerHTML.length.index + 1,
                '\n'
              );
            }
          }

          if (!quill.container.firstChild.innerText.trim()) {
            quill.focus();
          }
        }
        onTyping();
      });
    }
  }, [onChange, quill, Quill, onTyping]);

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
    }
    // eslint-disable-next-line
  }, [isPressEnter]);

  const insertEmoji = useCallback(
    (emoji) => {
      if (quill) {
        const cursorPosition = quill.getSelection(true).index;

        quill.insertText(cursorPosition, `${emoji}`);
        quill.setSelection(cursorPosition + 2);

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
        {/* <div className={classes.postMessageAction}>
          {value.trim() === '<p><br></p>' || value.trim() === '' || !value
            ? <Button
              classes={{
                disabled: classes.disablePostMessage
              }}
              disabled
            >
              <b>SEND</b>
              <SendMessageIcon className={classes.sendMessageIcon}/>
            </Button>
            : <Button
              className={classes.postMessage}
              onClick={handleClick(quill)}
            >
              <b>SEND</b>
              <SendMessageIcon className={classes.sendMessageIcon} />
            </Button>}
        </div> */}
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
      >
        <Picker onSelect={handleSelectEmoji} />
      </Popover>
      {files.length > 0 && (
        <div className={classes.files}>
          {files.map((file) => (
            <AttachFile file={file} onClose={() => onClose(file)} smallChat />
          ))}
        </div>
      )}

      <div className={cx(showError ? classes.error : classes.nonError)}>
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.errorMessage}
        >
          We couldn't send your message for some reason. 😥
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(MessageQuill);
