// @flow
import React, { useCallback, useState, useEffect } from 'react'
import Dialog from 'components/Dialog'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { sendFeedback as sendFeedbackAPI } from 'api/user'

const useStyles = makeStyles((theme) => ({
  container: {
  },
  body: {
    textAlign: 'center',
    padding: theme.spacing(0, 1, 2, 1)
  }
}))

type Props = {
  open: boolean, onClose: Function
};

const GiveFeedback = ({ open, onClose, origin }: Props) => {
  const classes = useStyles()
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const onChange = useCallback(e => {
    setFeedback(e.target.value)
  }, [])

  useEffect(() => {
    if (!open) setFeedback('')
  }, [open])

  const sendFeedback = useCallback(async () => {
    const res = await sendFeedbackAPI({ feedback, origin })
    if (res?.success) onClose()
    else setError('Failed to send Feedback')
  }, [feedback, onClose, origin])

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      onCancel={onClose}
      okTitle='Send Feedback'
      showActions
      onOk={sendFeedback}
      title='Great idea for CircleIn?'
      open={Boolean(open)}
    >
      <Grid container className={classes.container}>
        <Typography className={classes.body}>How do you think we can make CircleIn better for you? Have an idea that you'd like us to work on? Just enter it here and include your email so we can thank you!</Typography>
        <TextField
          fullWidth
          error={error}
          helperText={error}
          variant='outlined'
          onChange={onChange}
          value={feedback}
          multiline
          rowsMax={8}
        />
      </Grid>
    </Dialog>
  )
}

export default GiveFeedback
