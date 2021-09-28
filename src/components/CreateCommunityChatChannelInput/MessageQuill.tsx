/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuill } from 'react-quilljs';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Picker } from 'emoji-mart';
import Popover from '@material-ui/core/Popover';
import styles from '../_styles/CreateCommunityChatChannelInput/messageQuill';
import { uploadMedia } from '../../actions/user';
import EditorToolbar, { formats } from './Toolbar';
import { isMac } from '../../utils/helpers';

const MessageQuill = ({ classes, onChange, setValue, userId }) => {
  const [loading, setLoading] = useState(false);
  const [pasteImageUrl, setPasteImageUrl] = useState('');
  const [emojiPopupOpen, setEmojiPopupOpen] = useState(false);
  const inputFieldRef = useRef();
  const imageHandler = useCallback(
    async (imageDataUrl, type, imageData) => {
      setLoading(true);

      try {
        const file = imageData.toFile('');
        const result = await uploadMedia(userId, 1, file);
        const { readUrl } = result;
        setPasteImageUrl(readUrl);
      } catch (e) {
        setLoading(false);
      }
    },
    [userId]
  );
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      toolbar: '#one-touch-send',
      imageDropAndPaste: {
        handler: imageHandler
      },
      keyboard: {
        bindings: {
          emoji: {
            key: 'J',
            shortKey: true,
            altKey: !isMac(),
            handler: () => {
              setEmojiPopupOpen(true);
              return true;
            }
          }
        }
      }
    },
    scrollingContainer: 'editor',
    formats,
    placeholder: 'Start typing a message',
    preserveWhitespace: true
  } as any);
  const handleCloseEmojiPopup = useCallback(() => {
    setEmojiPopupOpen(false);
  }, []);

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

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
          const currentTooltipWidth = document.getElementById('one-touch-send')
            ? document.getElementById('one-touch-send').clientWidth
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
        const result = await uploadMedia(userId, 1, file);
        const { readUrl } = result;
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
        // TODO we are not passing enough arguments here.
        // I'm not sure how this should work, so just using any for now.
        (quill.setSelection as any)(cursorPosition + 2);
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
  return (
    <div className={classes.messageQuill}>
      <div className={classes.editor} ref={inputFieldRef}>
        <div className={classes.innerContainerEditor}>
          <div className={classes.editorToolbar}>
            <div id="editor" className={classes.editorable} ref={quillRef} />
            <EditorToolbar id="one-touch-send" handleSelect={insertEmoji} />
          </div>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
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
      </div>
    </div>
  );
};

export default withStyles(styles as any)(MessageQuill);
