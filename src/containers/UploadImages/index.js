// @flow

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';
import arrayMove from 'array-move';
import { withStyles } from '@material-ui/core/styles';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import UploadImagesForm from '../../components/UploadImagesForm';
import { getPresignedURLs } from '../../api/media';

const styles = () => ({});

type Props = {
  classes: Object,
  user: UserState
};

type Image = {
  id: string,
  image: string,
  file: Object,
  type: string
};

type State = {
  images: Array<Image>,
  isDropzoneDisabled: boolean
};

class UploadImages extends React.PureComponent<Props, State> {
  state = {
    images: [],
    isDropzoneDisabled: false
  };

  handleImageDelete = (id: string) => {
    const newState = update(this.state, {
      images: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, {
              $splice: [[index, 1]]
            });
          }
          return b;
        }
      }
    });

    this.setState(newState);
  };

  handleImageSave = (id, newImage) => {
    const newState = update(this.state, {
      images: {
        $apply: b => {
          const index = b.findIndex(item => item.id === id);
          if (index > -1) {
            return update(b, {
              [index]: {
                image: { $set: newImage }
              }
            });
          }
          return b;
        }
      }
    });
    this.setState(newState);
  };

  handleDrop = acceptedFiles => {
    acceptedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      const { path, type } = file;
      const extension = this.getFileExtension(path);
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const newImage = window.URL.createObjectURL(blob);
          this.setState(prevState => ({
            images: [
              ...prevState.images,
              {
                image: newImage,
                file,
                id: `${uuidv4()}.${extension}`,
                loaded: false,
                loading: false,
                error: false,
                type
              }
            ]
          }));
        });
    });
  };

  handleDropRejected = () => {};

  handleUploadImages = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const { images } = this.state;
    if (images.length === 0) return false;
    this.setImagesUploading();
    const fileNames = images.map(image => image.id);
    const result = await getPresignedURLs({
      userId,
      type: 3,
      fileNames
    });
    console.log(images);
    console.log(result);
    return axios
      .all(
        images.map(item =>
          this.uploadImageRequest(result[item.id].url, item.file, item.type)
        )
      )
      .then(
        axios.spread((...data) => {
          console.log(data);
          this.setImagesUploaded();
          return true;
        })
      )
      .catch(() => {
        return false;
      });
  };

  handleImageRetry = id => {
    console.log('retry: ', id);
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ images }) => ({
      images: arrayMove(images, oldIndex, newIndex)
    }));
  };

  setImagesUploading = () => {
    const newState = update(this.state, {
      images: {
        $apply: b => {
          return b.map(item => ({
            ...item,
            loading: true,
            loaded: false,
            error: false
          }));
        }
      },
      isDropzoneDisabled: { $set: true }
    });
    this.setState(newState);
  };

  setImagesUploaded = () => {
    const newState = update(this.state, {
      images: {
        $apply: b => {
          return b.map(item => ({
            ...item,
            loading: false,
            loaded: true,
            error: false
          }));
        }
      },
      isDropzoneDisabled: { $set: false }
    });
    this.setState(newState);
  };

  getFileExtension = filename => filename.split('.').pop();

  uploadImageRequest = (url, image, type) => {
    return axios.put(url, image, {
      headers: {
        'Content-Type': type
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { images, isDropzoneDisabled } = this.state;
    return (
      <div className={classes.root}>
        <UploadImagesForm
          images={images}
          isDropzoneDisabled={isDropzoneDisabled}
          onImageDelete={this.handleImageDelete}
          onImageSave={this.handleImageSave}
          onImageRetry={this.handleImageRetry}
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
          onSortEnd={this.handleSortEnd}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(UploadImages));
