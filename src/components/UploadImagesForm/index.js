// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditPhotoThumbnail from '../EditPhotoThumbnail';

const styles = theme => ({
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: 100,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  uploadIconSize: {
    width: 51,
    height: 51,
    color: '#909090'
  },
  thumbnails: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dragContainer: {
    position: 'relative',
    margin: theme.spacing(2)
  },
  drag: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: theme.spacing()
  },
  button: {
    padding: 4,
    backgroundColor: theme.circleIn.customBackground.iconButton
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  }
});

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
          accept={['image/*']}
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
                  <Typography variant="h6" align="center">
                    { loading ? 
                      <CircularProgress size={50} /> : 
                          `Drag 'n' drop some files here, or click select files. Only PNG, JPG and JPEG files are supported at this time`
                    }
                  </Typography>
                  <CloudUploadIcon className={classes.uploadIconSize} />
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
