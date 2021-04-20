/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'
import axios from 'axios';
import { useQuill } from 'react-quilljs';

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import EditorToolbar, { formats } from './Toolbar'
import { getPresignedURL } from '../../api/media';

const styles = theme => ({
  commentQuill: {
    width: '100%',
  },
  editor: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 2, 1),
    '& .ql-toolbar.ql-snow': {
      border: 'none'
    },
    '& .ql-editor': {
      maxHeight: 500,
      background: theme.circleIn.palette.hoverMenu,
      color: theme.palette.common.white,
      borderRadius: 20,
    }
  },
  innerContainerEditor: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    maxHeight: '100%',
    position: 'relative',
    '& .quill': {
      flex: 1,
      '& .ql-container.ql-snow': {
        border: 'none'
      }
    }
  },
  editorToolbar: {
    '& .ql-container.ql-snow': {
      border: 'none',
      bottom: 0,
      right: 0
    },
    width: '100%',
    position: 'relative',
    zIndex: 1,
    bottom: 0
  },
  postComment: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundImage: `linear-gradient(107.98deg, #5dc8fd -09.19%, #0074b5 122.45%)`
  },
  disablePostComment: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.disableButtonColor,
    color: `${theme.circleIn.palette.white} !important`
  },
  postCommentAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  postCommentIcon: {
    fontSize: 16,
    marginLeft: theme.spacing(0.5)
  },
  nonError: {
    display: 'none'
  },
  error: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 2, 1),
  },
  errorMessage: {
    fontSize: 12,
    color: theme.circleIn.palette.danger
  },
  loader: {
    position: 'absolute',
    zIndex: 1200,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  }
})

const CommentQuill = ({
  classes,
  onChange,
  value,
  setValue,
  feedId,
  handleClick,
  showError,
  userId
}) => {
  const [loading, setLoading] = useState(false)
  const [isNewLine, setIsNewLine] = useState(false)
  const [currentQuill, setCurrentQuill] = useState(null)
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: `#comment-toolbar-${feedId}`
    },
    scrollingContainer: `editor-${feedId}`,
    formats,
    placeholder: 'Type a comment...'
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        if (quill.getSelection(true)) {
          onChange(quill.container.firstChild.innerHTML)
          const currentFocusPosition = quill.getSelection(true).index
          const leftPosition = quill.getBounds(currentFocusPosition).left
          const currentTooltipWidth = document.getElementById(`comment-toolbar-${feedId}`)
            ? document.getElementById(`comment-toolbar-${feedId}`).clientWidth
            : 0
          const currentEditorWidth = quill.container.firstChild.clientWidth

          if (currentEditorWidth - currentTooltipWidth < leftPosition + 80) {
            setCurrentQuill(quill)
            setIsNewLine(true)
          }

          if (!quill.container.firstChild.innerText.trim()) {
            quill.focus()
            setIsNewLine(false)
          }
        }
      });
    }
  }, [feedId, isNewLine, onChange, quill]);

  useEffect(() => {
    if (currentQuill && isNewLine) {
      currentQuill.insertText(currentQuill.container.firstChild.innerHTML.length.index + 1, '\n')
    }
  }, [currentQuill, isNewLine])

  const selectLocalImage = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      setLoading(true)
      try {
        const file = input.files[0]
        const range = quill.getSelection(true);
        const { type } = file
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

        quill.insertEmbed(range.index, 'image', readUrl)
        quill.insertText(range.index + 1, '\n')
        setLoading(false)
      } catch (error) {
        quill.enable(true)
        setLoading(false)
      }
    };
  }, [quill, userId]);

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
    }
  }, [quill, selectLocalImage])

  const insertEmoji = useCallback(emoji => {
    if (quill) {
      const cursorPosition = quill.getSelection(true).index

      quill.insertText(cursorPosition, `${emoji  }`)
      quill.setSelection(cursorPosition + 2)

      const currentContent = quill.root.innerHTML
      setValue(currentContent)
    }
  }, [quill, setValue])

  return (
    <div className={classes.commentQuill}>
      <div className={classes.editor}>
        <div className={classes.innerContainerEditor}>
          <div className={classes.editorToolbar}>
            <div id={`editor-${feedId}`} className={classes.editorable} ref={quillRef} />
            <EditorToolbar id={`comment-toolbar-${feedId}`} handleSelect={insertEmoji} />
          </div>
          {loading && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </div>
        <div className={classes.postCommentAction}>
          {value ? <Button
            className={classes.postComment}
            onClick={handleClick(quill)}
          >
            <b>Comment</b>
          </Button>
            : <Button
              classes={{
                disabled: classes.disablePostComment
              }}
              disabled
              onClick={handleClick(quill)}
            >
              <b>Comment</b>
            </Button> }
        </div>
      </div>

      <div className={cx(showError ? classes.error : classes.nonError)}>
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.errorMessage}
        >
          We couldn't post your comment for some reason. 😥
        </Typography>
      </div>
    </div>
  )
}

export default withStyles(styles)(CommentQuill)