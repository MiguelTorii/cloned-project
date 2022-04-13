/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Picker } from 'emoji-mart';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

import { isMac } from 'utils/helpers';

import { uploadMedia } from 'actions/user';
import { useChatQuill } from 'features/chat';

import styles from '../_styles/CreateCommunityChatChannelInput/messageQuill';

import EditorToolbar, { formats } from './Toolbar';

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
  const { quill, quillRef, Quill } = useChatQuill(
    'one-touch-send',
    {
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
      placeholder: 'Start typing a message'
    },
    onChange
  );
  const handleCloseEmojiPopup = useCallback(() => {
    setEmojiPopupOpen(false);
  }, []);

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
  }

  useEffect(() => {
    if (!quill || !pasteImageUrl) return;
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'image', pasteImageUrl);
    quill.insertText(range.index + 1, '\n');
    setLoading(false);
    setPasteImageUrl('');
  }, [quill, pasteImageUrl]);
  const selectLocalImage = useCallback(() => {
    const input = document.createElement('input');
    if (!input || !quill) return;
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
          getContentAnchorEl={null}
        >
          <Picker onSelect={handleSelectEmoji} />
        </Popover>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(MessageQuill);
