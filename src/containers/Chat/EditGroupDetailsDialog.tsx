import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import { Create } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import AvatarEditor from '../../components/AvatarEditor/AvatarEditor';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import TextField from '../../components/Basic/TextField/TextField';
import { handleUpdateGroupPhoto } from '../../actions/chat';

const styles = (theme) => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  input: {
    display: 'none'
  },
  dialog: { ...dialogStyle, width: 800 },
  name: {
    color: theme.circleIn.palette.darkTextColor,
    fontSize: 14,
    lineHeight: '19px'
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
    lineHeight: '25px'
  },
  spacer: {
    marginBottom: theme.spacing(1)
  },
  hr: {
    border: '1px solid rgba(233, 236, 239, 0.25)',
    width: 'calc(100% + 48px)',
    height: 1
  },
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%'
  },
  editDialog: {
    maxWidth: 609,
    width: '100%'
  },
  penButton: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    width: 32,
    height: 32,
    minWidth: 32,
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    borderRadius: '100%'
  },
  avatar: {
    margin: theme.spacing(2),
    height: theme.spacing(14),
    width: theme.spacing(14),
    fontSize: 30
  }
});

type Props = {
  isLoading?: any;
  classes?: any;
  title?: string | null | undefined;
  channel?: Record<string, any>;
  open?: any;
  onClose?: (...args: Array<any>) => any;
  updateGroupName?: (...args: Array<any>) => any;
  localChannel?: Record<string, any>;
};

const EditGroupDetailsDialog = ({
  isLoading,
  classes,
  title,
  channel,
  open,
  onClose,
  updateGroupName,
  localChannel
}: Props) => {
  const [name, setName] = useState(localChannel.title);
  const dispatch = useDispatch();
  const [isEditingGroupPhoto, setIsEditingGroupPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groupImage, setGroupImage] = useState(undefined); // Group Image can be URL or Blob

  useEffect(() => {
    setName(localChannel.title);
  }, [localChannel]);
  useEffect(() => {
    setGroupImage(localChannel.thumbnail);
  }, [localChannel.thumbnail]);
  const groupImageUrl = useMemo(() => {
    if (groupImage instanceof Blob) {
      return window.URL.createObjectURL(groupImage);
    }

    return groupImage;
  }, [groupImage]);
  const handleGroupNameChange = useCallback(
    (e) => {
      if (e.target.value.length > 100) {
        return;
      }

      setName(e.target.value);
    },
    [setName]
  );
  const handleClose = useCallback(() => {
    setIsSaving(false);
    onClose();
    setName(localChannel.title);
  }, [localChannel.title, onClose]);

  const updateChannelName = async () => {
    if (name === channel.channelState.friendlyName) {
      return;
    }

    try {
      const res = await channel.updateFriendlyName(name);
      await updateGroupName(res);
    } catch (err) {}
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    await updateChannelName();

    if (groupImage instanceof Blob) {
      dispatch(handleUpdateGroupPhoto(channel.sid, groupImage, handleClose));
    } else {
      handleClose();
    }
  };

  const handleStartEditPhoto = () => setIsEditingGroupPhoto(true);

  const handleCancelEditPhoto = () => setIsEditingGroupPhoto(false);

  const handleSavePhoto = (imageData) => {
    setGroupImage(imageData);
    setIsEditingGroupPhoto(false);
  };

  return (
    <Dialog
      open={open}
      title={title || 'Edit Group Details'}
      className={classes.editDialog}
      onCancel={handleClose}
    >
      {isLoading && <CircularProgress className={classes.progress} />}
      <Typography variant="h6" gutterBottom>
        Are you sure you want to make changes to&nbsp;{name}?
      </Typography>
      <div className={classes.spacer}></div>
      <ValidatorForm className={classes.validatorForm} onSubmit={handleSubmit}>
        <div className={classes.form}>
          <TextField
            placeholder="Enter a New Friendly Name"
            label="Edit Group Name"
            fullWidth
            variant="outlined"
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
            size="medium"
          />
        </div>
      </ValidatorForm>
      <Box mt={2}>
        <Typography variant="h5" align="center">
          Edit Group Photo
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Box position="relative">
          <Avatar src={groupImageUrl} alt="group-image" className={classes.avatar}>
            <GroupIcon />
          </Avatar>
          <Button
            onClick={handleStartEditPhoto}
            classes={{
              root: classes.penButton
            }}
          >
            <Create />
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={handleClose}>Cancel</Button>
        <GradientButton onClick={handleSubmit} loading={isSaving} disabled={isSaving}>
          Save Changes
        </GradientButton>
      </Box>
      <AvatarEditor
        open={isEditingGroupPhoto}
        originalImage={groupImage}
        onCancel={handleCancelEditPhoto}
        onSave={handleSavePhoto}
      />
    </Dialog>
  );
};

export default withStyles(styles as any)(EditGroupDetailsDialog);
