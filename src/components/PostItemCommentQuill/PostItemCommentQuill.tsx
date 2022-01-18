/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { useQuill } from 'react-quilljs';
import { withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { useMediaQuery } from 'hooks';
import { getPresignedURL } from 'api/media';

import PostItemToolbar, { formats } from 'components/PostItemToolbar';

import styles from './PostItemCommentQuillStyles';

const PostItemCommentQuill = ({
  classes,
  onChange,
  value,
  setValue,
  feedId,
  handleClick,
  showError,
  userId,
  toolbarPrefix,
  isPastClassFlashcard
}) => {
  const { isMobileScreen } = useMediaQuery();

  const [loading, setLoading] = useState(false);
  const [isNewLine, setIsNewLine] = useState(false);
  const [currentQuill, setCurrentQuill] = useState(null);
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: `#comment-toolbar-${feedId}-${toolbarPrefix}`
    },
    scrollingContainer: `editor-${feedId}`,
    formats,
    placeholder: 'Type a comment...'
  });

  useEffect(() => {
    if (quill && isPastClassFlashcard) {
      quill.enable(false);
    }

    if (quill && !isPastClassFlashcard) {
      quill.enable();
    }
  }, [isPastClassFlashcard, quill]);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        if (quill.getSelection(true)) {
          onChange((quill as any).container.firstChild.innerHTML);
          const currentFocusPosition = quill.getSelection(true).index;
          const leftPosition = quill.getBounds(currentFocusPosition).left;
          const currentTooltipWidth = document.getElementById(
            `comment-toolbar-${feedId}-${toolbarPrefix}`
          )
            ? document.getElementById(`comment-toolbar-${feedId}-${toolbarPrefix}`).clientWidth
            : 0;
          const currentEditorWidth = (quill as any).container.firstChild.clientWidth;

          if (currentEditorWidth - currentTooltipWidth < leftPosition + 80) {
            setCurrentQuill(quill);
            setIsNewLine(true);
          }

          if (!(quill as any).container.firstChild.innerText.trim()) {
            quill.focus();
            setIsNewLine(false);
          }
        }
      });
    }
  }, [feedId, toolbarPrefix, isNewLine, onChange, quill]);

  useEffect(() => {
    if (currentQuill && isNewLine) {
      currentQuill.insertText(currentQuill.container.firstChild.innerHTML.length.index + 1, '\n');
    }
  }, [currentQuill, isNewLine]);

  useEffect(() => {
    if (quill && value) {
      quill.clipboard.dangerouslyPasteHTML(value);
      quill.setSelection({
        index: value.length,
        length: 0
      });
    } // eslint-disable-next-line
  }, [quill]);

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
        quill.setSelection((cursorPosition + 2) as any);
        const currentContent = quill.root.innerHTML;
        setValue(currentContent);
      }
    },
    [quill, setValue]
  );

  return (
    <div className={classes.commentQuill}>
      <div className={classes.editor}>
        <div className={classes.innerContainerEditor}>
          <div className={classes.editorToolbar}>
            <div id={`editor-${feedId}`} className={classes.editorable} ref={quillRef} />
            <Box
              className={classNames({
                [classes.toolbarBox]: true,
                [classes.toolbarBoxMobile]: isMobileScreen
              })}
            >
              <PostItemToolbar
                id={`comment-toolbar-${feedId}-${toolbarPrefix}`}
                handleSelect={insertEmoji}
              />
            </Box>
          </div>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
        <div className={classes.postCommentAction}>
          {value ? (
            <Button className={classes.postComment} onClick={handleClick(quill)}>
              <b>Comment</b>
            </Button>
          ) : (
            <Button
              classes={{
                disabled: classes.disablePostComment
              }}
              disabled
              onClick={handleClick(quill)}
            >
              <b>Comment</b>
            </Button>
          )}
        </div>
      </div>

      <div className={classNames(showError ? classes.error : classes.nonError)}>
        <Typography component="p" variant="subtitle1" className={classes.errorMessage}>
          {"We couldn't post your comment for some reason. 😥"}
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles as any)(PostItemCommentQuill);
