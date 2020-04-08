import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getClassmates } from 'api/chat'
import queryString from 'query-string'
import List from '@material-ui/core/List';
import Dialog, { dialogStyle } from 'components/Dialog';
import Classmate from 'components/ClassmatesDialog/Classmate'

const ClassmatesDialog = ({ close, state, courseDisplayName }) => {
  const classes = makeStyles(() => ({
    dialog: {
      ...dialogStyle,
      height: 700
    },
    list: {
      overflowY: 'scroll'
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
        className={classes.dialog}
        onCancel={close}
        open={state}
        title={`${courseDisplayName} Classmates`}
      >
        <Typography>Classmates who have joined CircleIn</Typography>
        <List className={classes.list}>
          {classmates.map(c => <Classmate close={close} key={c.userId} classmate={c} />)}
        </List>
      </Dialog>
    </div>
  );
}

export default ClassmatesDialog
