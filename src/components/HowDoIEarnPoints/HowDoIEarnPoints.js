// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '../Dialog/Dialog';

import { styles } from '../_styles/HowDoIEarnPoints';

type Props = {
  classes: Object,
  open: boolean,
  onClose: Function
};

class HowDoIEarnPoints extends React.PureComponent<Props> {
  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Dialog className={classes.dialog} open={open} onCancel={onClose} title="CircleIn">
        <Typography id="video-points-description" color="textPrimary" paragraph>
          If you need help, have any questions or have a great idea, email us at
          support@circleinapp.com
        </Typography>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HowDoIEarnPoints);
