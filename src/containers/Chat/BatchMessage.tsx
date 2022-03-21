import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { UserState } from '../../reducers/user';
import Tooltip from '../Tooltip/Tooltip';
import BatchMessageDialog from '../BatchMessageDialog/BatchMessageDialog';
import { PERMISSIONS } from '../../constants/common';
import { closeNewChannelAction } from '../../actions/chat';
import { URL } from 'constants/navigation';

const useStyles = makeStyles((theme) => ({
  selectClasses: {
    margin: theme.spacing(),
    float: 'right'
  }
}));

const BatchMessage = ({
  location: { pathname }
}: {
  location: {
    pathname: string;
  };
}) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const permission = useSelector((state: { user: UserState }) => state.user.data.permission);

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
    dispatch(closeNewChannelAction());
  }, [dispatch]);

  if (!canBatchMessage || pathname !== URL.CHAT) {
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
          Select Classes
        </Button>
      </Tooltip>
    </div>
  );
};

export default withRouter(BatchMessage);
