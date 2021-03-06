import React from 'react';

import arrayMove from 'array-move';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import update from 'immutability-helper';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuidv4 from 'uuid/v4';

import { withStyles } from '@material-ui/core/styles';

import * as notificationsActions from 'actions/notifications';
import { getPresignedURLs } from 'api/media';
import UploadImagesForm from 'components/UploadImagesForm/UploadImagesForm';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import type { UserState } from 'reducers/user';
import type { State as StoreState } from 'types/state';

const styles = (theme) => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Image = {
  id: string;
  image: string;
  file: Record<string, any>;
  type: string;
};

type ImageUrl = {
  fullNoteUrl: string;
  note: string;
  noteUrl: string;
};

type Props = {
  classes?: Record<string, any>;
  className?: string;
  enqueueSnackbar?: (...args: Array<any>) => any;
  notes?: Array<ImageUrl>;
  imageChange?: (...args: Array<any>) => any;
  user?: UserState;
  handleUpdateImages?: any;
  images?: any;
};

type State = {
  firstLoad: boolean;
  loading: boolean;
  isDropzoneDisabled: boolean;
};

class UploadImages extends React.PureComponent<Props, State> {
  state = {
    firstLoad: true,
    loading: false,
    isDropzoneDisabled: false
  };

  componentWillReceiveProps = async (nextProps) => {
    const { handleUpdateImages, images } = this.props;
    const { firstLoad } = this.state;

    if (!firstLoad) {
      return;
    }

    const { notes } = nextProps;
    notes.forEach((n) => {
      const url = n.fullNoteUrl;
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const newImage = window.URL.createObjectURL(blob);
          const { note } = n;
          const { type } = blob;
          const extension = this.getFileExtension(note);
          this.setState({
            firstLoad: false
          });
          handleUpdateImages([
            images,
            {
              image: newImage,
              file: blob,
              id: `${uuidv4()}.${extension}`,
              loaded: true,
              loading: false,
              error: false,
              type
            }
          ]);
        });
    });
  };

  handleImageDelete = (id: string) => {
    const { handleUpdateImages, images } = this.props;
    const index = images.findIndex((item) => item.id === id);

    if (index > -1) {
      handleUpdateImages(
        update(images, {
          $splice: [[index, 1]]
        })
      );
    }
  };

  handleImageSave = (id, newImage) => {
    const { handleUpdateImages, images } = this.props;
    const index = images.findIndex((item) => item.id === id);

    if (index > -1) {
      handleUpdateImages(
        update(images, {
          [index]: {
            image: {
              $set: newImage
            }
          }
        })
      );
    }
  };

  compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    return imageCompression(file, options);
  };

  handleDrop = (acceptedFiles) => {
    const { handleUpdateImages, images } = this.props;
    const updatedImages = [...images];
    acceptedFiles.forEach(async (file) => {
      this.setState({
        loading: true
      });
      const compressedFile =
        file.type === 'application/pdf' ? file : await this.compressImage(file);
      const url = URL.createObjectURL(compressedFile);
      const { path, type } = file;
      const extension = this.getFileExtension(path);
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const newImage = window.URL.createObjectURL(blob);
          updatedImages.push({
            image: newImage,
            file,
            id: `${uuidv4()}.${extension}`,
            loaded: false,
            loading: false,
            error: false,
            type
          });
          handleUpdateImages([...updatedImages]);
          this.setState({
            loading: false
          });
        });
    });
  };

  handleDropRejected = () => {
    this.setState({
      loading: false
    });
    const { enqueueSnackbar, classes } = this.props;
    enqueueSnackbar({
      notification: {
        message: `Only PDF, PNG, JPG and JPEG of maximum 40 MB size files are supported at this time`,
        options: {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          autoHideDuration: 3000,
          ContentProps: {
            classes: {
              root: classes.stackbar
            }
          }
        }
      }
    });
  };

  handleUploadImages = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const { images } = this.props;

    if (images.length === 0) {
      throw new Error('no images');
    }

    if (images.length === 0) {
      return [];
    }

    this.setImagesUploading();

    // Only upload images that are newly added.
    const newImages = images.filter((image) => !!image.file);
    const fileNames = newImages.map((image) => image.id);
    const result = await getPresignedURLs({
      userId,
      type: 3,
      fileNames
    });
    return axios
      .all(
        newImages.map(async (item) => {
          const compress =
            item.file.type === 'application/pdf' ? item.file : await this.compressImage(item.file);
          this.uploadImageRequest(result[item.id].url, compress, item.type);
        })
      )
      .then(
        axios.spread(() => {
          this.setImagesUploaded();
          return images;
        }) as any
      )
      .catch(() => {
        throw new Error('error uploading');
      });
  };

  handleImageRetry = (id) => {
    console.log('retry: ', id);
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { handleUpdateImages, images } = this.props;
    handleUpdateImages(arrayMove(images, oldIndex, newIndex));
  };

  setImagesUploading = () => {
    const { handleUpdateImages, images } = this.props;
    const updatedImages = images.map((item) => ({
      ...item,
      loading: true,
      loaded: false,
      error: false
    }));
    this.setState({
      isDropzoneDisabled: true
    });
    handleUpdateImages(updatedImages);
  };

  setImagesUploaded = () => {
    const { handleUpdateImages, images } = this.props;
    const updatedImages = images.map((item) => ({
      ...item,
      loading: false,
      loaded: true,
      error: false
    }));
    setTimeout(() => {
      handleUpdateImages(updatedImages);
      this.setState({
        isDropzoneDisabled: false
      });
    }, 4000);
  };

  getFileExtension = (filename) => filename.split('.').pop();

  uploadImageRequest = (url, image, type) =>
    axios.put(url, image, {
      headers: {
        'Content-Type': type
      }
    });

  render() {
    const { className } = this.props;
    const { loading, isDropzoneDisabled } = this.state;
    const { images } = this.props;
    return (
      <ErrorBoundary>
        <div className={className}>
          <UploadImagesForm
            images={images}
            isDropzoneDisabled={isDropzoneDisabled}
            onImageDelete={this.handleImageDelete}
            onImageSave={this.handleImageSave}
            onImageRetry={this.handleImageRetry}
            onDrop={this.handleDrop}
            loading={loading}
            onDropRejected={this.handleDropRejected}
            onSortEnd={this.handleSortEnd}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(UploadImages));
