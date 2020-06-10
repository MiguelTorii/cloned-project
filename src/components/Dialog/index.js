/* eslint-disable react/no-danger */
// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MuiDialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { updateVisibility as updateVisiblityAction } from 'actions/dialog';

export const dialogStyle = {
  borderRadius: 20,
  overflow: 'auto',
}

const styles = theme => ({
  dialogPaper: dialogStyle,
  contentRoot: {
    display: 'flex',
    flexDirection: 'column',
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
  ariaLabelledBy,
  children,
  classes,
  className,
  disableBackdropClick=false,
  disableActions=false,
  disableOk=false,
  disableEscapeKeyDown=false,
  loading=false,
  okTitle="Got it!",
  secondaryOkTitle="",
  onCancel,
  onOk = () => {},
  onSecondaryOk = () => {},
  open,
  showActions=false,
  showCancel=false,
  showHeader=true,
  setOkRef= () => {},
  title,
  updateVisibility,
  ...props
}: {
  ariaDescribedBy: ?string,
  ariaLabelledBy: ?string,
  children: Object | Array<Object>,
  classes: Object,
  className: ?string,
  disableBackdropClick: ?boolean,
  disableActions: ?boolean,
  disableEscapeKeyDown: ?boolean,
  loading: ?boolean,
  okTitle: ?string,
  secondaryOkTitle: ?string,
  onCancel: Function,
  onOk: ?Function,
  onSecondaryOk: ?Function,
  open: boolean,
  showActions: ?boolean,
  showCancel: ?boolean,
  showHeader: ?boolean,
  title: ?ReactNode,
  updateVisibility: Function,
  props: Object
}) => {
  useEffect(() => {
    updateVisibility(open);
  }, [open, updateVisibility]);

  return (
    <MuiDialog
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy || 'circle-in-dialog-title'}
      classes={{ paper: className || classes.dialogPaper, container: classes.container }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      maxWidth="lg"
      onClose={onCancel}
      open={open}
      {...props}
    >
      {
        showHeader &&
        <div>
          <CloseIcon className={classes.closeIcon} onClick={onCancel} />
          <hr className={classes.hr} />
        </div>
      }
      <DialogContent
        aria-labelledby='circle-in-dialog-content'
        classes={{ root: classes.contentRoot }}>
        {
          title &&
          typeof title === 'string' ?
            <div className={classes.title} id='circle-in-dialog-title'>{title}</div> :
            title
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
              id='dialog-cancel-button'
              className={classes.button}
              color="primary"
              disabled={disableActions}
              onClick={onCancel}
            >
              Cancel
            </Button>
          }
          {
            secondaryOkTitle &&
          <Button
            className={classes.button}
            color="primary"
            disabled={disableActions}
            onClick={onSecondaryOk}
            variant="contained"
          >
            {secondaryOkTitle}
          </Button>
          }
          <Button
            className={classes.button}
            color="primary"
            ref={setOkRef}
            disabled={disableActions || disableOk}
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

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      updateVisibility: updateVisiblityAction
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Dialog));

