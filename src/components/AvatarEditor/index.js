import React, { useEffect, useMemo, useRef, useState } from 'react';
import withRoot from 'withRoot';
import Dialog from '../Dialog';
import { makeStyles, Box, Grid, Button } from '@material-ui/core';
import Toolbar from './Toolbar';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import GradientButton from '../Basic/Buttons/GradientButton';
import DefaultAvatarEditor from 'react-avatar-editor';
import _ from 'lodash';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 480,
    zIndex: 2000,
  }
}));

type Props = {
  originalImage: string,
  open: boolean,
  onCancel: Function,
  onSave: Function
};

const AvatarEditor = ({ originalImage, open, onCancel, onSave }: Props) => {
  const classes = useStyles();
  const [image, setImage] = useState(null); // image can be URL or File.
  const [scale, setScale] = useState(1.0);
  const [angle, setAngle] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [fileInputRef, setFileInputRef] = useState(null);
  const editorRef = useRef(null);
  const disabledActions = useMemo(() => {
    return [scale === 1.0 && 'zoom_out'];
  }, [scale]);

  useEffect(() => {
    setScale(1.0);
    setAngle(0);
  }, [image]);

  useEffect(() => {
    if (originalImage instanceof Blob) {
      setImage(window.URL.createObjectURL(originalImage));
    } else {
      setImage(originalImage);
    }
  }, [originalImage]);

  useEffect(() => {
    if (fileInputRef && !originalImage) {
      handleChangePhoto();
    }
  }, [fileInputRef]);

  // Event handlers

  const onAction = (action) => {
    switch (action) {
      case 'zoom_in':
        setScale(scale + 0.1);
        break;
      case 'zoom_out':
        setScale(_.max([scale - 0.1, 1.0]));
        break;
      case 'rotate_right':
        setAngle(angle + 10);
        break;
      case 'rotate_left':
        setAngle(angle - 10);
        break;
      case 'crop':
        break;
      default:
        throw new Error('Unknown action');
    }
  }

  const handleChangePhoto = () => {
    fileInputRef.click();
  };

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!image) {
      onSave(null);
      return ;
    }

    setIsSaving(true);

    const canvas = editorRef.current.getImage().toDataURL();

    fetch(canvas)
      .then(res => res.blob())
      .then(blob => {
        onSave(blob);
        setIsSaving(false);
      });
  };

  const handleDelete = () => {
    setImage(null);
  };

  return (
    <Dialog
      title="Edit Profile Picture"
      className={classes.root}
      open={open}
      onCancel={onCancel}
    >
      <Box py={4} display="flex" justifyContent="center">
        <DefaultAvatarEditor
          ref={editorRef}
          image={image}
          width={250}
          height={250}
          borderRadius={250}
          scale={scale}
          rotate={angle}
          crossOrigin="anonymous"
        />
      </Box>
      <Box px={5} mb={4}>
        <Toolbar
          disabledActions={disabledActions}
          onAction={onAction}
        />
      </Box>
      <Grid container justify="space-between">
        <Grid item>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <TransparentButton
                compact
                onClick={handleChangePhoto}
              >
                Change Photo
              </TransparentButton>
            </Grid>
            <Grid item>
              <GradientButton
                compact
                loading={isSaving}
                disabled={isSaving}
                onClick={handleSave}
              >
                Save
              </GradientButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Hidden xsUp implementation="css">
        <input
          ref={setFileInputRef}
          type="file"
          accept=".png,.jpg"
          onChange={handleImageChange}
        />
      </Hidden>
    </Dialog>
  );
};

export default withRoot(AvatarEditor);
