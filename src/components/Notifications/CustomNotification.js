// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '../Dialog';

import { styles } from '../_styles/Notifications/CustomNotification';

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
        ariaDescribedBy="custom-notification-description"
        className={classes.root}
        onCancel={onClose}
        onOk={onClose}
        open={open}
        showActions
        title={title}
      >
        <Typography
          className={classes.details}
          color="textPrimary"
          dangerouslySetInnerHTML={{ __html: details }}
          id="custom-notification-description"
          variant="h6"
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(CustomNotification);
