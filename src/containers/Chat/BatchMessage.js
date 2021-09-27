// @flow

import React, { useMemo, useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { UserState } from 'reducers/user';
import { withRouter } from 'react-router';
import Tooltip from 'containers/Tooltip/Tooltip';
import BatchMessageDialog from 'containers/BatchMessageDialog/BatchMessageDialog';
import { PERMISSIONS } from 'constants/common';

const useStyles = makeStyles((theme) => ({
  selectClasses: {
    margin: theme.spacing(),
    float: 'right'
  }
}));

const BatchMessage = ({
  user,
  closeNewChannel,
  location: { pathname }
}: {
  user: UserState,
  closeNewChannel: func,
  location: {
    pathname: string
  }
}) => {
  const classes = useStyles();
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

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => {
    setOpen(false);
    closeNewChannel();
  }, [closeNewChannel]);

  if (!canBatchMessage || pathname !== '/chat') { return null; }

  return (
    <div className={classes.selectClasses}>
      <BatchMessageDialog open={open} closeDialog={closeDialog} />
      <Tooltip
        id={9048}
        placement="left"
        text="Send one message to all the classes you support - all at once. 🎉"
      >
        <Button variant="contained" onClick={openDialog} color="primary">
          Select Classes
        </Button>
      </Tooltip>
    </div>
  );
};

export default withRouter(BatchMessage);
