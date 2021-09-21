// @flow

import React, { useEffect, useMemo, useRef, useState } from 'react';
import withRoot from 'withRoot';
import { Box, Grid } from '@material-ui/core';
import DefaultAvatarEditor from 'react-avatar-editor';
import _ from 'lodash';
import Hidden from '@material-ui/core/Hidden';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import GradientButton from '../Basic/Buttons/GradientButton';
import TransparentButton from '../Basic/Buttons/TransparentButton';
import Toolbar from './Toolbar';
import Dialog from '../Dialog/Dialog';
import { useStyles } from '../_styles/AvatarEditor/index';

type Props = {
  originalImage: string,
  open: boolean,
  title?: string,
  onCancel: Function,
  onSave: Function
};

const AvatarEditor = ({
  originalImage,
  open,
  title,
  onCancel,
  onSave
}: Props) => {
  const classes = useStyles();
  const [image, setImage] = useState(null); // image can be URL or File.
  const [scale, setScale] = useState(1.0);
  const [angle, setAngle] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const disabledActions = useMemo(() => {
    return [scale === 1.0 && 'zoom_out'];
  }, [scale]);
  const [dropzoneRef, setDropzoneRef] = useState(null);

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
  }, [originalImage, open]);

  useEffect(() => {
    if (dropzoneRef && open && !originalImage) {
      dropzoneRef.open();
    }
    // eslint-disable-next-line
  }, [dropzoneRef]);

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
  };

  const handleSelectFile = () => {
    if (dropzoneRef) {
      dropzoneRef.open();
    }
  };

  const handleDropzoneAccepted = (files) => {
    setImage(files[0]);
  };

  const handleFileDialogCancel = () => {
    if (open && !originalImage) {
      onCancel();
    }
  };

  const handleSave = () => {
    if (!image) {
      onSave(null);
      return;
    }

    setIsSaving(true);

    const canvas = editorRef.current.getImage().toDataURL();

    fetch(canvas)
      .then((res) => res.blob())
      .then((blob) => {
        onSave(blob);
        setIsSaving(false);
      });
  };

  // const handleDelete = () => {
  //   setImage(null);
  // };

  return (
    <Dialog
      title={title ?? 'Edit Profile Picture'}
      className={clsx(classes.root, !image && classes.hidden)}
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
        />
      </Box>
      <Box px={5} mb={4}>
        <Toolbar disabledActions={disabledActions} onAction={onAction} />
      </Box>
      <Grid container justifyContent="space-between">
        <Grid item>
          {/*<Button onClick={handleDelete}>*/}
          {/*  Delete*/}
          {/*</Button>*/}
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <TransparentButton compact onClick={handleSelectFile}>
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
      <Hidden implementation="css">
        <Dropzone
          ref={setDropzoneRef}
          accept="image/*"
          onDropAccepted={handleDropzoneAccepted}
          onFileDialogCancel={handleFileDialogCancel}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      </Hidden>
    </Dialog>
  );
};

export default withRoot(AvatarEditor);
