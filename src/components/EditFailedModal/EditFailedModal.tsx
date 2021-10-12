import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '../Dialog/Dialog';
import useStyles from '../_styles/EditFailedModal';

type Props = {
  onOk: (...args: Array<any>) => any;
  open: boolean;
};

const EditFailedModal = ({ onOk, open }: Props) => {
  const classes: any = useStyles();
  return (
    <Dialog
      ariaDescribedBy="edit-message-alert"
      className={classes.dialog}
      okTitle="Back to editing"
      okButtonClass={classes.okButtonClass}
      headerTitleClass={classes.headerTitleClass}
      hrClass={classes.hrClass}
      onOk={onOk}
      open={open}
      showActions
      showCancel={false}
      title="Error editing your message"
    >
      <Typography variant="body1">
        Eek! Sorry about that. It’s not you, it’s us, something went wrong while editing your
        message. Please try again!
      </Typography>
    </Dialog>
  );
};

export default EditFailedModal;
