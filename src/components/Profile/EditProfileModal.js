import React, { useEffect, useState } from 'react';
import withRoot from '../../withRoot';
import Dialog from '../Dialog/Dialog';
import { Button, Grid, Box } from '@material-ui/core';
import TextField from '../Basic/TextField/TextField';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import GradientButton from '../Basic/Buttons/GradientButton';
import AvatarEditor from '../AvatarEditor/AvatarEditor';
import Avatar, { DEFAULT_AVATAR_SIZE } from '../Avatar/Avatar';
import { Create } from '@material-ui/icons';
import type { About, UserProfile } from '../../types/models';
import _ from 'lodash';
import { useStyles } from '../_styles/Profile/EditProfileModal';
import { getInitials } from 'utils/chat';

type Props = {
  profile: UserProfile,
  about: Array<About>,
  open: boolean,
  isSaving: boolean,
  onClose: Function,
  onSave: Function
};

const MAX_BIO_LENGTH = 160;

const EditProfileModal = ({
  profile,
  about,
  open,
  isSaving,
  onClose,
  onSave
}: Props) => {
  const classes = useStyles();
  const [image, setImage] = useState(null); // image can be URL or BLOB data from the editor.
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [bioText, setBioText] = useState('');

  useEffect(() => {
    const bioIndex = _.findIndex(about, (item) => item.id === 6);
    if (bioIndex >= 0) {
      setBioText(about[bioIndex].answer);
    }
  }, [about]);

  useEffect(() => {
    if (open) {
      setImage(profile.userProfileUrl);
    }
    // eslint-disable-next-line
  }, [open]);

  // Event handlers

  const handleCancelEditAvatar = () => {
    setIsEditingAvatar(false);
  };

  const handleChangeAvatar = (data) => {
    setImage(data);
    setIsEditingAvatar(false);
  };

  const handleSave = () => {
    onSave(image === profile.userProfileUrl ? undefined : image, {
      bio: bioText
    });
  };

  return (
    <Dialog
      title="Edit Your Profile"
      open={open}
      onCancel={onClose}
      maxWidth="lg"
    >
      <Grid container className={classes.root} spacing={4}>
        <Grid item xs={12}>
          <Box display="inline-block" position="relative">
            <Avatar
              mobileSize={DEFAULT_AVATAR_SIZE.desktop}
              src={image}
              initialText={getInitials(
                `${profile.firstName} ${profile.lastName}`
              )}
            />
            <Button
              onClick={() => setIsEditingAvatar(true)}
              classes={{
                root: classes.penButton
              }}
            >
              <Create />
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            InputLabelProps={{
              shrink: true
            }}
            value={bioText}
            onChange={(event) =>
              event.target.value.length <= MAX_BIO_LENGTH &&
              setBioText(event.target.value)
            }
            maxLength={MAX_BIO_LENGTH}
            label={`Bio(${
              MAX_BIO_LENGTH - bioText.length
            } characters remaining)`}
            placeholder="Add a quick description about you here! Your classmates will view your profile to learn more about you!"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <TransparentButton compact onClick={onClose}>
              Cancel
            </TransparentButton>
            <Box ml={2}>
              <GradientButton
                compact
                onClick={handleSave}
                loading={isSaving}
                disabled={isSaving}
              >
                Save Changes
              </GradientButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <AvatarEditor
        open={isEditingAvatar}
        originalImage={image}
        onCancel={handleCancelEditAvatar}
        onSave={handleChangeAvatar}
      />
    </Dialog>
  );
};

export default withRoot(EditProfileModal);
