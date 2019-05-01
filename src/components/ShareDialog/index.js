// @flow

import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit
  },
  link: {
    padding: theme.spacing.unit,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    borderRadius: 4,
    marginRight: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  open: boolean,
  isLoading: boolean,
  link: string,
  onClose: Function,
  onLinkCopied: Function
};

type State = {};

class ShareDialog extends React.PureComponent<Props, State> {
  render() {
    const {
      classes,
      open,
      link,
      isLoading,
      onLinkCopied,
      onClose
    } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <DialogTitle id="share-dialog-title">Share this Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="share-dialog-description" color="textPrimary">
            Copy this link and send it to your friends.
          </DialogContentText>
          <div className={classes.content}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Fragment>
                <div className={classes.link}>
                  <Typography>{link}</Typography>
                </div>
                <CopyToClipboard text={link} onCopy={onLinkCopied}>
                  <Button variant="outlined" color="primary" autoFocus>
                    <FileCopyIcon className={classes.icon} />
                    Copy
                  </Button>
                </CopyToClipboard>
              </Fragment>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShareDialog);
