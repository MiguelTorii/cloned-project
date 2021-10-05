import React, { useMemo, useCallback, useState } from 'react';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { UserState } from '../../reducers/user';
import Tooltip from '../Tooltip/Tooltip';
import BatchMessageDialog from '../BatchMessageDialog/BatchMessageDialog';
import { PERMISSIONS } from '../../constants/common';
import useStyles from './_styles/batchMessage';

const BatchMessage = ({
  user,
  closeNewChannel,
  location: { pathname }
}: {
  user?: UserState;
  closeNewChannel?: () => void;
  location?: {
    pathname: string;
  };
}) => {
  const classes: any = useStyles();
  const {
    data: { permission }
  } = user;
  const [open, setOpen] = useState(false);
  const canBatchMessage = useMemo(
    () =>
      permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) &&
      permission.includes(PERMISSIONS.ONE_TOUCH_SEND_CHAT),
    [permission]
  );
  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => {
    setOpen(false);
    closeNewChannel();
  }, [closeNewChannel]);

  if (!canBatchMessage || pathname !== '/chat') {
    return null;
  }

  return (
    <div className={classes.selectClasses}>
      <BatchMessageDialog open={open} closeDialog={closeDialog} />
      <Tooltip
        id={9048}
        placement="left"
        text="Send one message to all the classes you support - all at once. 🎉"
      >
        <Button variant="contained" onClick={openDialog} color="primary">
          Create DM
        </Button>
      </Tooltip>
    </div>
  );
};

export default withRouter(BatchMessage);