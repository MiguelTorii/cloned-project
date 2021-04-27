// @flow

import React, { useCallback, useState } from 'react'
import {
  ValidatorForm,
} from 'react-material-ui-form-validator'
import withStyles from '@material-ui/core/styles/withStyles'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Dialog, { dialogStyle } from 'components/Dialog'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  input: {
    display: 'none'
  },
  dialog: {
    ...dialogStyle,
    width: 800
  },
  name: {
    color: theme.circleIn.palette.darkTextColor,
    fontSize: 14,
    lineHeight: '19px',
  },
  helperText: {
    color: theme.circleIn.palette.darkTextColor,
    fontSize: 12,
    lineHeight: '16px',
    textAlign: 'right',
    marginRight: 0
  },
  labelText: {
    color: theme.circleIn.palette.secondaryText,
    fontSize: 18,
    lineHeight: '25px',
  },
  spacer: {
    marginBottom: theme.spacing(1),
  },
  hr: {
    border: '1px solid rgba(233, 236, 239, 0.25)',
    width: 'calc(100% + 48px)',
    height: 1,
  },
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%'
  }
});

type Props = {
  onClose: Function,
  onSubmit: Function,
  onLoadOptions: Function,
  updateGroupName: Function,
  title: ?string,
  channel: Object,
};

const EditGroupDetailsDialog = ({
  classes,
  isLoading,
  title,
  channel,
  open,
  onClose,
  onSubmit,
  okLabel,
  updateGroupName,
}: Props) => {
  const [name, setName] = useState(channel?.channelState.friendlyName || "")

  const handleGroupNameChange = useCallback((e) => {
    if (e.target.value.length > 100) {
      return;
    }
    setName(e.target.value);
  }, [setName]);

  const handleClose = useCallback(() => {
    setName('')
    onClose()
  }, [onClose]);

  const handleSubmit = async () => {
    if (name === channel.channelState.friendlyName) {
      onClose()
      return;
    }

    try {
      const res = await channel.updateFriendlyName(name)
      await updateGroupName(res);
    } catch (err) {}
    onClose()
  }

  return (
    <Dialog
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      showActions
      showCancel
      title={title || "Edit Group Details"}
      okTitle="Save Changes"
    >
      {isLoading && <CircularProgress className={classes.progress}/>}
      <Typography variant='h6' gutterBottom>
        Are you sure you want to make changes to&nbsp;
        {channel.channelState.friendlyName}?
      </Typography>
      <div className={classes.spacer}></div>
      <ValidatorForm
        className={classes.validatorForm}
        onSubmit={handleSubmit}
      >
        <div className={classes.form}>
          <TextField
            placeholder='Enter a New Friendly Name'
            label='Edit Group Name'
            fullWidth
            variant='outlined'
            onChange={handleGroupNameChange}
            value={name}
            helperText={`${100 - (name?.length || 0)} characters remaining`}
            FormHelperTextProps={{
              className: classes.helperText
            }}
            InputLabelProps={{
              className: classes.labelText
            }}
            inputProps={{
              className: classes.name
            }}
            size='medium'
          />
        </div>
      </ValidatorForm>
    </Dialog>
  );
}

export default withStyles(styles)(EditGroupDetailsDialog);
