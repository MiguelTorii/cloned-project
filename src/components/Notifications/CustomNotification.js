// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '../DialogTitle';

const styles = () => ({
  details: {
    '& img': {
      width: '100% !important',
      height: 'auto !important'
    }
  }
});

type Props = {
  classes: Object,
  open: boolean,
  title: string,
  details: string,
  onClose: Function
};

type State = {};

class CustomNotification extends React.PureComponent<Props, State> {
  componentDidMount = () => {};

  render() {
    const { classes, open, title, details, onClose } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        className={classes.root}
        aria-labelledby="custom-notification-title"
        aria-describedby="custom-notification-description"
      >
        <DialogTitle
          variant="h5"
          id="custom-notification-title"
          onClose={onClose}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="h6"
            id="custom-notification-description"
            color="textPrimary"
            className={classes.details}
            dangerouslySetInnerHTML={{ __html: details }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(CustomNotification);
