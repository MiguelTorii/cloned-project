import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ValidatorForm } from 'react-material-ui-form-validator';
import { useDispatch } from 'react-redux';

import { Box } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Create } from '@material-ui/icons';
import GroupIcon from '@material-ui/icons/Group';

import { handleUpdateGroupPhoto } from 'actions/chat';
import AvatarEditor from 'components/AvatarEditor/AvatarEditor';
import GradientButton from 'components/Basic/Buttons/GradientButton';
import TextField from 'components/Basic/TextField/TextField';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import { useChannelMetadataById } from 'features/chat';
import { selectLocalById } from 'redux/chat/selectors';
import { useAppSelector } from 'redux/store';

import type { Channel } from 'types/models';

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
  channel: Channel;
  classes?: any;
  isLoading?: any;
  onClose?: (...args: Array<any>) => any;
  open?: any;
  title?: string | null | undefined;
  updateGroupName?: (...args: Array<any>) => any;
};

const EditGroupDetailsDialog = ({
  channel,
  classes,
  isLoading,
  onClose,
  open,
  title,
  updateGroupName
}: Props) => {
  const { data: channelMetadata } = useChannelMetadataById(channel?.sid);
  const local = useAppSelector((state) => selectLocalById(state, channel?.sid));
  const metadata = channelMetadata || local;
  const dispatch = useDispatch();
  const [isEditingGroupPhoto, setIsEditingGroupPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputName, setInputName] = useState('');
  const [groupImage, setGroupImage] = useState<string | Blob>(); // Group Image can be URL or

  // There's problems during conditionals during render in determening friendlyName exists so we have to keep them separate
  const friendlyName = channel?.friendlyName;
  const name = friendlyName || (metadata && 'groupName' in metadata) ? metadata?.groupName : '';

  useEffect(() => {
    if (!metadata && !local) return;
    setInputName(friendlyName || name);
  }, [local, metadata, name, friendlyName]);

  const groupImageUrl = useMemo(() => {
    if (groupImage instanceof Blob) {
      return window.URL.createObjectURL(groupImage);
    }

    return groupImage;
  }, [groupImage]);

  const handleGroupNameChange = (e) => {
    if (e.target.value.length > 100) {
      return;
    }
    setInputName(e.target.value);
  };

  const handleClose = useCallback(() => {
    setIsSaving(false);
    onClose?.();
    setInputName(friendlyName || name);
  }, [name, onClose, friendlyName]);

  const updateChannelName = async () => {
    if (channel.attributes.community_id) {
      return;
    }
    try {
      const res = await channel.updateFriendlyName(inputName);
      await updateGroupName?.(res);
    } catch (err) {}
  };

  const handleSubmit = async () => {
    if (!metadata) return;

    setIsSaving(true);
    await updateChannelName();

    if (groupImage instanceof Blob) {
      dispatch(handleUpdateGroupPhoto(metadata.id, groupImage, handleClose));
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
        Are you sure you want to make changes to&nbsp;{friendlyName || name}?
      </Typography>
      <div className={classes.spacer} />
      <ValidatorForm className={classes.validatorForm} onSubmit={handleSubmit}>
        <div className={classes.form}>
          <TextField
            placeholder="Enter a New Friendly Name"
            label="Edit Group Name"
            fullWidth
            variant="outlined"
            onChange={handleGroupNameChange}
            value={inputName}
            helperText={`${100 - (inputName?.length || 0)} characters remaining`}
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
