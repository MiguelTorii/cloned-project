/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import axios from 'axios';
import { useQuill } from 'react-quilljs';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import styles from 'components/_styles/CreateCommunityChatChannelInput/messageQuill';

import EditorToolbar, { formats } from './Toolbar';
import { getPresignedURL } from '../../api/media';

const MessageQuill = ({ classes, onChange, setValue, userId, showError }) => {
  const [loading, setLoading] = useState(false);
  const [pasteImageUrl, setPasteImageUrl] = useState('');

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
      imageDropAndPaste: {
        handler: imageHandler
      }
    },
    scrollingContainer: 'editor',
    formats,
    placeholder: 'Send a message to channel',
    preserveWhitespace: true
  });

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

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
      });
    }
  }, [onChange, quill, Quill]);

  useEffect(() => {
    if (pasteImageUrl) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', pasteImageUrl);
      quill.insertText(range.index + 1, '\n');
      setLoading(false);
      setPasteImageUrl('');
    }
  }, [quill, pasteImageUrl]);

  const selectLocalImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      setLoading(true);
      try {
        const file = input.files[0];
        const range = quill.getSelection(true);
        const { type } = file;
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

        quill.insertEmbed(range.index, 'image', readUrl);
        quill.insertText(range.index + 1, '\n');
        setLoading(false);
      } catch (error) {
        quill.enable(true);
        setLoading(false);
      }
    };
  }, [quill, userId]);

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }
  }, [quill, selectLocalImage]);

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

  return (
    <div className={classes.messageQuill}>
      <div className={classes.editor}>
        <div className={classes.innerContainerEditor}>
          <div className={classes.editorToolbar}>
            <div id="editor" className={classes.editorable} ref={quillRef} />
            <EditorToolbar id="message-toolbar" handleSelect={insertEmoji} />
          </div>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>

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
