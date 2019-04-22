// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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
  onImageDelete: Function,
  onImageSave: Function,
  onDrop: Function,
  onDropRejected: Function,
  onImageRetry: Function
};

class UploadImagesForm extends React.PureComponent<Props> {
  render() {
    const {
      classes,
      images,
      isDropzoneDisabled,
      onImageDelete,
      onImageSave,
      onDrop,
      onDropRejected,
      onImageRetry
    } = this.props;
    return (
      <div>
        <Dropzone
          accept={['image/*']}
          onDrop={onDrop}
          onDropRejected={onDropRejected}
          maxSize={4 * 1000000}
          disabled={isDropzoneDisabled}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={classes.dropZone}>
                  <Typography variant="h6">
                    {"Drag 'n' drop some files here, or click to select files"}
                  </Typography>
                  <CloudUploadIcon className={classes.uploadIconSize} />
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <div className={classes.thumbnails}>
          {images.map(item => (
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
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UploadImagesForm);
