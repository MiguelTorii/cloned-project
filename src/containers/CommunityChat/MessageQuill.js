/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import cx from 'classnames'
import axios from 'axios'
import { useQuill } from 'react-quilljs'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import EditorToolbar, { formats } from './Toolbar'
import { getPresignedURL } from '../../api/media'

import styles from './_styles/messageQuill';

const MessageQuill = ({
  classes,
  onChange,
  value,
  setValue,
  onSendMessage,
  showError,
  onTyping,
  userId
}) => {
  const [loading, setLoading] = useState(false)
  const [isNewLine, setIsNewLine] = useState(false)
  const [currentQuill, setCurrentQuill] = useState(null)
  const [isPressEnter, setPressEnter] = useState(false)
  const [pasteImageUrl, setPasteImageUrl] = useState('')

  const bindings = useMemo(() => {
    return {
      enter: {
        key: 'enter',
        handler: () => {
          setPressEnter(true)
          return false
        }
      },
    }
  }, [])

  const imageHandler = useCallback(async (imageDataUrl, type, imageData) => {
    setLoading(true)
    try {
      const file = imageData.toFile('')

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
      setPasteImageUrl(readUrl)
    } catch (e) {
      setLoading(false)
    }
  }, [userId])

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
    placeholder: 'Send a message to channel',
    preserveWhitespace: true
  });

  if (Quill && !quill) {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
  }

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        if (quill.getSelection(true)) {
          onChange(quill.container.firstChild.innerHTML)
          const currentFocusPosition = quill.getSelection(true).index
          const leftPosition = quill.getBounds(currentFocusPosition).left
          const currentTooltipWidth = document.getElementById('message-toolbar')
            ? document.getElementById('message-toolbar').clientWidth
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
        onTyping()
      });
    }
  }, [isNewLine, onChange, quill, Quill, onTyping]);

  useEffect(() => {
    if (currentQuill && isNewLine) {
      currentQuill.insertText(currentQuill.container.firstChild.innerHTML.length.index + 1, '\n')
    }
  }, [currentQuill, isNewLine])

  useEffect(() => {
    if (pasteImageUrl) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', pasteImageUrl)
      quill.insertText(range.index + 1, '\n')
      setLoading(false)
      setPasteImageUrl('')
    }
  }, [quill, pasteImageUrl])

  useEffect(() => {
    async function sendMessage() {
      if (value.trim() === '<p><br></p>'
        || !value
        || value.replaceAll('<p>', '').replaceAll('</p>', '').trim() === '') {
        setValue('')
        setPressEnter(false)
      } else {
        await onSendMessage(value.replaceAll('<p><br></p>', ''))
        setValue('')
        setPressEnter(false)
        quill.setText('')
      }
    }

    if (isPressEnter) {
      sendMessage()
    }
    // eslint-disable-next-line
  }, [isPressEnter])

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
  )
}

export default withStyles(styles)(MessageQuill)