// @flow

import React from 'react';
import fetch from 'isomorphic-fetch';
import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';
import { withStyles } from '@material-ui/core/styles';
import UploadImagesForm from '../../components/UploadImagesForm';

const styles = () => ({});

type Props = {
  classes: Object
};

type Image = {
  id: string,
  image: string
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
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const newImage = window.URL.createObjectURL(blob);
          this.setState(prevState => ({
            images: [
              ...prevState.images,
              {
                image: newImage,
                id: uuidv4(),
                loaded: false,
                loading: false,
                error: false
              }
            ]
          }));
        });
    });
  };

  handleDropRejected = () => {};

  handleUploadImages = () => {
    const newState = update(this.state, {
      images: {
        $apply: b => {
          return b.map(item => ({ ...item, loading: true }));
        }
      },
      isDropzoneDisabled: { $set: true }
    });
    this.setState(newState);
    return new Promise(resolve => {
      setTimeout(() => {
        const state = update(this.state, {
          images: {
            $apply: b => {
              return b.map(item => ({ ...item, loading: false, error: true }));
            }
          },
          isDropzoneDisabled: { $set: false }
        });
        this.setState(state);
        resolve(state.images);
      }, 3000);
    });
  };

  handleImageRetry = id => {
    console.log('retry: ', id);
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
        />
      </div>
    );
  }
}

export default withStyles(styles)(UploadImages);
