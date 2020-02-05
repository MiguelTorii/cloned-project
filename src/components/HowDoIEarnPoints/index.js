// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentIcon: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(2),
    height: 40
  }
});

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

class HowDoIEarnPoints extends React.PureComponent<Props> {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="how-earn-points-dialog-title"
        aria-describedby="how-earn-points-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="video-points-description"
            className={classes.circleIn}
            variant="h4"
            paragraph
          >
            CircleIn
          </DialogContentText>
          <DialogContentText
            id="video-points-description"
            color="textPrimary"
            paragraph
          >
              If you need help, have any questions or have a great idea, email us at support@circleinapp.com
          </DialogContentText>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HowDoIEarnPoints);
