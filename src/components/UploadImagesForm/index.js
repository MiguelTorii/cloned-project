// @flow
import React, { useEffect, useState, useCallback } from 'react';
import Dropzone from 'react-dropzone';
// import {
//   sortableContainer,
//   sortableElement,
//   sortableHandle
// } from 'react-sortable-hoc';
// import IconButton from '@material-ui/core/IconButton';
// import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid'
import { ReactComponent as PaperClip } from 'assets/svg/paper_clip.svg'
import { ReactComponent as DeleteFile } from 'assets/svg/delete.svg'
// import EditPhotoThumbnail from '../EditPhotoThumbnail';
import { styles } from '../_styles/UploadImagesForm';

// type Image = {
//   id: string,
//   image: string,
//   loaded: boolean,
//   loading: boolean,
//   error: boolean
// };

const UploadImagesForm = ({
  classes,
  images,
  isDropzoneDisabled,
  onImageDelete,
  // onImageSave,
  onDrop,
  loading,
  onDropRejected,
  // onImageRetry,
  // onSortEnd
}) => {
  const [fileNames, setFileNames] = useState('')

  useEffect(() => {
    if (images.length) {
      let names = '';
      images.forEach(image => {
        names += `${image.file.path} ✅ `
      });

      setFileNames(names)
    }
  }, [images])

  const deleteFile = useCallback(() => {
    onImageDelete(images[images.length - 1].id)
  }, [images, onImageDelete])

  // const DragHandle = sortableHandle(({ children }) => children);

  // const SortableItem = sortableElement(({ children }) => children);

  // const SortableContainer = sortableContainer(({ children }) => {
  //   return children;
  // });

  return (
    <div>
      {!images.length ? <Dropzone
        accept={['image/*', 'application/pdf']}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        maxSize={4 * 10000000}
        disabled={isDropzoneDisabled}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={classes.dropZone}>
                <div className={classes.dropLabel} align="center">
                  { loading ?
                    <CircularProgress size={25} /> :
                    <Grid
                      container
                      alignItems='center'
                      justify='space-between'
                    >
                      <FormControl className={classes.uploadFileForm} fullWidth variant="outlined">
                        <InputLabel className={classes.uploadFileLabel} htmlFor="upload-file">Upload a File</InputLabel>
                        <OutlinedInput
                          id="upload-file"
                          disabled
                          classes={{
                            root: classes.rootUploadFile,
                            input: classes.uploadFileInput,
                            notchedOutline: classes.notchedOutline,
                          }}
                          placeholder="Optional - you can post an image too!"
                          startAdornment={
                            <InputAdornment position="start">
                              <PaperClip />
                            </InputAdornment>
                          }
                          labelWidth={120}
                        />
                      </FormControl>
                    </Grid>
                  }
                </div>
              </div>
            </div>
          </section>
        )}
      </Dropzone> : <FormControl className={classes.uploadFileForm} fullWidth variant="outlined">
        <InputLabel className={classes.uploadFileLabel} htmlFor="upload-file">Upload a File</InputLabel>
        <OutlinedInput
          id="upload-file"
          classes={{
            root: classes.rootUploadFile,
            input: classes.uploadFileInput,
            notchedOutline: classes.notchedOutline,
          }}
          value={fileNames}
          placeholder="Optional - you can post an image too!"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="delete" onClick={deleteFile}>
                <DeleteFile/>
              </IconButton>
            </InputAdornment>
          }
          labelWidth={120}
        />
      </FormControl>
      }
      {/* <SortableContainer axis="xy" useDragHandle onSortEnd={onSortEnd}>
        <div className={classes.thumbnails}>
          {images.map((item, index) => (
            <SortableItem key={item.id} index={index}>
              <div className={classes.dragContainer}>
                <EditPhotoThumbnail
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  loaded={item.loaded}
                  loading={item.loading}
                  error={item.error}
                  onSave={onImageSave}
                  onDelete={onImageDelete}
                  onImageRetry={onImageRetry}
                />
                <DragHandle>
                  <div className={classes.drag}>
                    <IconButton
                      color="inherit"
                      aria-label="Drag"
                      className={classes.button}
                    >
                      <DragIndicatorIcon
                        className={classes.icon}
                        fontSize="small"
                      />
                    </IconButton>
                  </div>
                </DragHandle>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContainer> */}
    </div>
  );
}
export default withStyles(styles)(UploadImagesForm);
