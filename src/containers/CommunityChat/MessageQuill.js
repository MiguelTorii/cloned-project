/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cx from 'classnames';
import axios from 'axios';
import { useQuill } from 'react-quilljs';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { bytesToSize } from 'utils/chat';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import AttachFile from 'components/FileUpload/AttachFile';
import EditorToolbar, { formats } from './Toolbar';
import { getPresignedURL } from '../../api/media';

import styles from './_styles/messageQuill';

const MessageQuill = ({
  classes,
  onChange,
  value,
  setValue,
  onSendMessage,
  focusMessageBox,
  showError,
  onTyping,
  userId,
  enqueueSnackbar,
  setFiles,
  files,
  isCommunityChat
}) => {
  const [loading, setLoading] = useState(false);
  const [isPressEnter, setPressEnter] = useState(false);
  const [pasteImageUrl, setPasteImageUrl] = useState('');

  const bindings = useMemo(
    () => ({
      enter: {
        key: 'enter',
        handler: () => {
          setPressEnter(true);
          return false;
        }
      }
    }),
    []
  );

  const imageHandler = useCallback(
    async (imageDataUrl, type, imageData) => {
      setLoading(true);
      try {
        const file = imageData.toFile('');

        const result = await getPresignedURL({
          userId,
          type: 1,
          mediaType: file.type
        });

        const { readUrl, url } = result;

        await axios.put(url, file, {
          headers: {
            'Content-Type': type
          }
        });
        setPasteImageUrl(readUrl);
      } catch (e) {
        setLoading(false);
      }
    },
    [userId]
  );

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
    if (pasteImageUrl) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', pasteImageUrl);
      quill.insertText(range.index + 1, '\n');
      setLoading(false);
      setPasteImageUrl('');
    }
  }, [quill, pasteImageUrl]);

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

  const handleUploadFile = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = async () => {
      setLoading(true);
      try {
        const file = input.files[0];
        const { type, name, size } = file;

        if (size < 40960) {
          const result = await getPresignedURL({
            userId,
            type: 1,
            mediaType: type
          });
          const { readUrl, url } = result;
          await axios.put(url, file, {
            headers: {
              'Content-Type': type
            }
          });

          if (type.includes('image')) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', readUrl);
            quill.insertText(range.index + 1, '\n');
          } else {
            const anyFile = {
              type,
              name,
              url: readUrl,
              size: bytesToSize(size)
            };

            setFiles([...files, anyFile]);
          }
        } else {
          enqueueSnackbar({
            notification: {
              message: 'Upload File size is over 40 MB',
              options: {
                variant: 'info',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                autoHideDuration: 3000,
                ContentProps: {
                  classes: {
                    root: classes.stackbar
                  }
                }
              }
            }
          });
        }
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
      {files.length > 0 && (
        <div className={classes.files}>
          {files.map((file) => (
            <AttachFile file={file} onClose={() => onClose(file)} />
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
