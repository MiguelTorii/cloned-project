/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import cx from 'classnames';
import { Picker } from 'emoji-mart';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { useQuill } from 'react-quilljs';
import { useDispatch } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { FILE_LIMIT_SIZE } from 'constants/chat';
import { isMac } from 'utils/helpers';

import { showNotification } from 'actions/notifications';
import { uploadMedia } from 'actions/user';

import AttachFile from '../FileUpload/AttachFile';

import EditorToolbar, { formats } from './Toolbar';

import styles from 'containers/CommunityChat/_styles/messageQuill';

type Props = {
  classes?: any;
  onChange?: any;
  value?: any;
  setValue?: any;
  onSendMessage?: any;
  showError?: any;
  userId?: any;
  setFiles?: any;
  files?: any;
  isNamedChannel?: boolean;
};

const MessageQuill = ({
  classes,
  onChange,
  value,
  setValue,
  onSendMessage,
  showError,
  userId,
  setFiles,
  files,
  isNamedChannel
}: Props) => {
  const dispatch = useDispatch();

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
        const anyFile = {
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
    [setFiles, dispatch, classes, files]
  );

  const imageHandler = useCallback(
    async (type, imageData) => {
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
    placeholder: isNamedChannel ? 'Send a message to channel' : 'Send a message',
    preserveWhitespace: true
  } as any);

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

  useEffect(() => {
    if (quill && value) {
      quill.clipboard.dangerouslyPasteHTML(value);
      quill.setSelection(
        quill.getSelection(true).index + (quill as any).container.firstChild.innerHTML.length
      );
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      quill.focus();
      quill.on('text-change', () => {
        if (quill.getSelection(true)) {
          onChange((quill as any).container.firstChild.innerHTML);

          if (
            (quill as any).container.firstChild.innerHTML.length > quill.getSelection(true).index
          ) {
            quill.setSelection(
              quill.getSelection(true).index + (quill as any).container.firstChild.innerHTML.length
            );
          }

          const currentFocusPosition = quill.getSelection(true).index;
          const leftPosition = quill.getBounds(currentFocusPosition).left;
          const currentTooltipWidth = document.getElementById('message-toolbar')
            ? document.getElementById('message-toolbar').clientWidth
            : 0;
          const currentEditorWidth = (quill as any).container.firstChild.clientWidth;

          if (currentEditorWidth - currentTooltipWidth < leftPosition + 80) {
            if (!(quill as any).container.firstChild.innerHTML.includes('<p>\n</p>')) {
              quill.insertText(
                (quill as any).container.firstChild.innerHTML.length.index + 1,
                '\n'
              );
            }
          }

          if (!(quill as any).container.firstChild.innerText.trim()) {
            quill.focus();
          }
        }
      });
    }
  }, [onChange, quill, Quill]);

  useEffect(() => {
    async function sendMessage() {
      if (
        files.length === 0 &&
        (value.trim() === '<p><br></p>' ||
          !value ||
          value.replaceAll('<p>', '').replaceAll('</p>', '').trim() === '')
      ) {
        setPressEnter(false);
      } else {
        await onSendMessage((quill as any).container.firstChild.innerHTML);
        setPressEnter(false);
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
    <div className={classes.editMessageQuill}>
      <div className={classes.editor} ref={inputFieldRef}>
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

      <div className={cx(showError ? classes.error : classes.nonError)}>
        <Typography component="p" variant="subtitle1" className={classes.errorMessage}>
          {"We couldn't send your message for some reason. ????"}
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(MessageQuill);
