import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { getClassmates } from 'api/chat'
import queryString from 'query-string'
import List from '@material-ui/core/List';
import Classmate from 'components/ClassmatesDialog/Classmate'

const ClassmatesDialog = ({ close, state, courseDisplayName }) => {
  const classes = makeStyles(theme => ({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    content: {
      padding: 0
    }
  }))()

  const [classmates, setClassmates] = useState([])

  useEffect(() => {
    const init = async () => {
      const {
        sectionId,
        classId
      } = queryString.parse(window.location.search)
      if (!sectionId && !classId) return
      const res = await getClassmates({ sectionId, classId })
      if (res) setClassmates(res)
    }

    if (state) init()
  }, [state])

  return (
    <div>
      <Dialog
        open={state}
        onClose={close}
        maxWidth='sm'
        fullWidth
      >
        <MuiDialogTitle
          disableTypography
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">{courseDisplayName} Classmates</Typography>
            <Typography>Classmates who have joined CircleIn</Typography>
          </div>
          <IconButton aria-label="close" className={classes.closeButton} onClick={close}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent className={classes.content}>
          <List>
            {classmates.map(c => <Classmate close={close} key={c.userId} classmate={c} />)}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ClassmatesDialog
