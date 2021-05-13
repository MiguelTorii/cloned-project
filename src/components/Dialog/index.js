/* eslint-disable react/no-danger */
// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiDialog from '@material-ui/core/Dialog';
import { CircularProgress } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import cx from 'classnames'

import { styles } from '../_styles/Dialog';

export const dialogStyle = {
  borderRadius: 20,
  overflow: 'auto',
}

const Dialog = ({
  ariaDescribedBy,
  ariaLabelledBy,
  children,
  classes,
  className,
  contentClassName,
  disableBackdropClick = false,
  disableActions = false,
  disableOk = false,
  disableEscapeKeyDown = false,
  loading = false,
  okTitle = "Got it!",
  okButtonClass,
  secondaryOkTitle = "",
  maxWidth="lg",
  cancelTitle = 'Cancel',
  secondaryRemoveTitle = "",
  secondaryVariant = 'contained',
  onCancel,
  onOk = () => {},
  onSecondaryOk = () => {},
  onSecondaryRemove = () => {},
  open,
  showActions = false,
  showCancel = false,
  showHeader = true,
  setOkRef = () => {},
  rightButton = null,
  title,
  headerTitleClass,
  hrClass,
  closeButtonClass,
  ...props
}: {
  ariaDescribedBy: ?string,
  ariaLabelledBy: ?string,
  children: Object | Array<Object>,
  classes: Object,
  className: ?string,
  okButtonClass: ?string,
  disableBackdropClick: ?boolean,
  disableActions: ?boolean,
  disableEscapeKeyDown: ?boolean,
  loading: ?boolean,
  okTitle: ?string,
  cancelTitle: ?string,
  secondaryOkTitle: ?string,
  onCancel: Function,
  onOk: ?Function,
  onSecondaryOk: ?Function,
  open: boolean,
  showActions: ?boolean,
  showCancel: ?boolean,
  showHeader: ?boolean,
  title: ?ReactNode,
  headerTitleClass: ?string,
  hrClass: ?string,
  closeButtonClass: ?string,
  rightButton: ?ReactNode,
  props: Object
}) => {
  // useEffect(() => {
  // updateVisibility(open);
  // }, [open, updateVisibility]);

  return (
    <MuiDialog
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy || 'circle-in-dialog-title'}
      classes={{ paper: className || classes.dialogPaper, container: classes.container }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      maxWidth={maxWidth}
      disableRestoreFocus
      onClose={onCancel}
      open={open}
      {...props}
    >
      {
        showHeader &&
          <div className={classes.headerContainer}>
            {
              title &&
                (typeof title === 'string' ?
                  <div className={cx(headerTitleClass, classes.title)} id='circle-in-dialog-title'>{title}</div> :
                  title)
            }
            <CloseIcon className={classes.closeIcon} onClick={onCancel} />
            {
              title &&
                <hr className={cx(hrClass, classes.hr)} />
            }
          </div>
      }
      <DialogContent
        aria-labelledby='circle-in-dialog-content'
        classes={{ root: contentClassName || classes.contentRoot }}>
        {
          !showHeader && title &&
            (typeof title === 'string' ?
              <div className={classes.title} id='circle-in-dialog-title'>{title}</div> :
              title)
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
          {rightButton}
          {
            secondaryRemoveTitle &&
            <Button
              className={cx(classes.button, classes.removeButton)}
              color="secondary"
              disabled={disableActions}
              onClick={onSecondaryRemove}
            >
              {secondaryRemoveTitle}
            </Button>
          }
          {
            showCancel &&
            <Button
              id='dialog-cancel-button'
              className={cx(closeButtonClass, classes.button)}
              color="primary"
              disabled={disableActions}
              onClick={onCancel}
            >
              {cancelTitle}
            </Button>
          }
          {
            secondaryOkTitle &&
            <Button
              className={classes.button}
              color="primary"
              disabled={disableActions}
              onClick={onSecondaryOk}
              variant={secondaryVariant}
            >
              {secondaryOkTitle}
            </Button>
          }
          <Button
            className={cx(okButtonClass, classes.button)}
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

export default withStyles(styles)(Dialog);

