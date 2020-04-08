// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiDialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import withWidth from '@material-ui/core/withWidth';
import withRoot from '../../withRoot';

export const dialogStyle = {
  borderRadius: 20,
  overFlow: 'hidden',
}

const styles = theme => ({
  dialogPaper: dialogStyle,
  contentRoot: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 24,
    paddingTop: 8
  },
  container: {
    borderRadius: 20
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 28,
    fontStretch: 'normal',
    fontWeight: 'bold',
    letterSpacing: 1.1,
    marginBottom: 16,
    textAlign: 'center'
  },
  closeIcon: {
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
  button: {
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: '14px',
    padding: '9px 18px'
  },
  buttons: {
    margin: 10
  }
})

const Dialog = ({
  ariaDescribedBy,
  children,
  classes,
  className,
  disableBackdropClick=false,
  disableActions=false,
  disableEscapeKeyDown=false,
  loading=false,
  okTitle="Got it!",
  onCancel,
  onOk = () => {},
  open,
  showActions=false,
  showCancel=false,
  showHeader=true,
  title
}: {
  ariaDescribedBy: ?string,
  children: Object | Array<Object>,
  classes: Object,
  className: ?string,
  disableBackdropClick: ?boolean,
  disableActions: ?boolean,
  disableEscapeKeyDown: ?boolean,
  loading: ?boolean,
  okTitle: ?string,
  onCancel: Function,
  onOk: ?Function,
  open: boolean,
  showActions: ?boolean,
  showCancel: ?boolean,
  showHeader: ?boolean,
  title: ?string
}) => {
  return (
    <MuiDialog
      aria-describedby={ariaDescribedBy}
      aria-labelledby='circle-in-dialog-title'
      classes={{ paper: className || classes.dialogPaper, container: classes.container }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      maxWidth="lg"
      onClose={onCancel}
      open={open}
    >
      {
        showHeader &&
        <div>
          <CloseIcon className={classes.closeIcon} onClick={onCancel} />
          <hr className={classes.hr} />
        </div>
      }
      <DialogContent classes={{ root: classes.contentRoot }}>
        {
          title &&
          <div id='circle-in-dialog-title' className={classes.title}>{title}</div>
        }
        {
          loading
            ? <CircularProgress
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%'
              }}
            />
            : children
        }
      </DialogContent>
      {
        showActions &&
        <DialogActions className={classes.buttons}>
          {
            showCancel &&
            <Button
              className={classes.button}
              color="primary"
              disabled={disableActions}
              onClick={onCancel}
            >
              Cancel
            </Button>
          }
          <Button
            className={classes.button}
            color="primary"
            disabled={disableActions}
            onClick={onOk}
            variant="contained"
          >
            {okTitle}
          </Button>
        </DialogActions>
      }
    </MuiDialog>
  )
}

export default withRoot(withStyles(styles)(withWidth()(Dialog)));