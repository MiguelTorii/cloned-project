// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import Grid from '@material-ui/core/Grid'
import EditPhotoThumbnail from '../EditPhotoThumbnail';
import { styles } from '../_styles/UploadImagesForm';

type Image = {
  id: string,
  image: string,
  loaded: boolean,
  loading: boolean,
  error: boolean
};

type Props = {
  classes: Object,
  images: Array<Image>,
  isDropzoneDisabled: boolean,
  loading: boolean,
  onImageDelete: Function,
  onImageSave: Function,
  onDrop: Function,
  onDropRejected: Function,
  onImageRetry: Function,
  onSortEnd: Function
};

const DragHandle = sortableHandle(({ children }) => children);

const SortableItem = sortableElement(({ children }) => children);

const SortableContainer = sortableContainer(({ children }) => {
  return children;
});

class UploadImagesForm extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      images,
      isDropzoneDisabled,
      onImageDelete,
      onImageSave,
      onDrop,
      loading,
      onDropRejected,
      onImageRetry,
      onSortEnd
    } = this.props;
    return (
      <div>
        <Dropzone
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
                      <CircularProgress size={50} /> : 
                      <Grid
                        container
                        alignItems='center'
                        justify='space-between'
                      >
                        <Grid 
                          xs={2}
                          md={1}
                          item
                          alignItems='flex-end'
                          justify='flex-end'
                          container
                        >
                          <AddIcon className={classes.addIcon} color='primary' />
                        </Grid>
                        <Grid xs={10} md={11} item>
                          <Typography>
                            Tap to add notes (JPG, JPEG, PNG, PDF files supported)
                          </Typography>
                        </Grid>
                      </Grid>
                    }
                  </div>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <SortableContainer axis="xy" useDragHandle onSortEnd={onSortEnd}>
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
        </SortableContainer>
      </div>
    );
  }
}

export default withStyles(styles)(UploadImagesForm);
