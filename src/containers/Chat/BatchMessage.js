// @flow

import React, { useMemo, useCallback, useState } from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import Dialog from 'components/Dialog';
import ClassMultiSelect from 'containers/ClassMultiSelect'
import Typography from '@material-ui/core/Typography'
import MultipleChatTextField from 'containers/Chat/MultipleChatTextField'
import { UserState } from 'reducers/user'
import { ChatState } from 'reducers/chat'
import CircularProgress from '@material-ui/core/CircularProgress'
import { sendBatchMessage } from 'api/chat'
import { withRouter } from 'react-router'

const useStyles = makeStyles((theme) => ({
  selectClasses: {
    margin: theme.spacing(),
    float: 'right'
  },
  dialogRoot: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  }
}))

const BatchMessage = ({
  user,
  chat,
  closeNewChannel,
  location: {
    pathname
  }
}: {
  user: UserState,
  chat: ChatState,
  closeNewChannel: func,
  location: {
    pathname: string
  }
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState(null)
  const { isExpert } = user
  const { data: { local } } = chat

  const readyToSend = useMemo(() => (
    Boolean((message && selectedClasses.length > 0) || !loading)
  ), [loading, message, selectedClasses.length])

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])

  const onSendMessage = useCallback(async () => {
    setLoading(true)

    const chatIds = {}
    Object.keys(local).forEach(sid => {
      const { title } = local[sid]
      if (selectedClasses.find(sc => (
        `${sc.className} Class Chat` === title
      ))) {
        chatIds[sid] = true
      }
    })

    const res = await sendBatchMessage({ message, chatIds: Object.keys(chatIds) })

    if (res) {
      setOpen(false)
      closeNewChannel()
      setMessage('')
      setSelectedClasses([])
    }

    setLoading(false)
  }, [closeNewChannel, local, message, selectedClasses])

  if (
    !isExpert ||
    pathname !== '/chat'
  ) return null

  return (
    <div
      className={classes.selectClasses}
    >
      <Button
        variant='contained'
        onClick={openDialog}
        color='primary'
      >
        Select Classes
      </Button>
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
        onClose={closeDialog}
        onCancel={closeDialog}
      >
        <div className={classes.dialogRoot}>
          <Typography className={classes.title}>
          Send a message to multiple classes
          </Typography>

          <MultipleChatTextField
            setMessage={setMessage}
            input={input}
            message={message}
            setInput={setInput}
          />

          <ClassMultiSelect
            variant='standard'
            placeholder='Select Classes...'
            selected={selectedClasses}
            onSelect={setSelectedClasses}
          />

          <Button
            variant='contained'
            onClick={onSendMessage}
            disabled={!readyToSend}
            color='primary'
          >
            {loading ? <CircularProgress /> : 'Send Multiple Messages'}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default withRouter(BatchMessage)
