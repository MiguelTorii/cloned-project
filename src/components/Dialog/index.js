// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';

const styles = theme => ({
  dialogPaper: {
    borderRadius: 20,
    width: 1000,
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 34,
    fontStretch: 'normal',
    fontWeight: 'bold',
    letterSpacing: 'normal',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  closeButton: {
    color: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    marginLeft: 20,
    marginTop: 20
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 1,
  },
})

const Dialog = ({
  children,
  classes,
  onClose,
  open,
  title
}: {
  children: Object | Array<Object>,
  classes: Object,
  onClose: Function,
  open: boolean,
  title: string
}) => {
  return (
    <MuiDialog
      classes={{ paper: classes.dialogPaper }}
      maxWidth="lg"
      onClose={onClose}
      open={open}
    >
      <div>
        <CloseIcon className={classes.closeButton} onClick={onClose}  />
        <hr className={classes.hr} />
      </div>
      <DialogContent>
        <div className={classes.title}>{title}</div>
        {children}
      </DialogContent>
    </MuiDialog>
  )
}

export default withRoot(withStyles(styles)(withWidth()(Dialog)))
