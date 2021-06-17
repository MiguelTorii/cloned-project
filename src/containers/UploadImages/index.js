// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';
import arrayMove from 'array-move';
import { withStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression'
import * as notificationsActions from '../../actions/notifications';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import UploadImagesForm from '../../components/UploadImagesForm';
import { getPresignedURLs } from '../../api/media';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  root: {
    padding: theme.spacing(2)
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
});

type Image = {
  id: string,
  image: string,
  file: Object,
  type: string
};

type ImageUrl = {
  fullNoteUrl: string,
  note: string,
  noteUrl: string
};

type Props = {
  classes: Object,
  enqueueSnackbar: Function,
  // eslint-disable-next-line
  notes: Array<ImageUrl>,
  imageChange: Function,
  user: UserState
};

type State = {
  images: Array<Image>,
  firstLoad: boolean,
  loading: boolean,
  isDropzoneDisabled: boolean
};

class UploadImages extends React.PureComponent<Props, State> {
  state = {
    images: [],
    firstLoad: true,
    loading: false,
    isDropzoneDisabled: false
  };

  // componentDidMount() {
  //   if (localStorage.getItem('note')) {
  //     const note = JSON.parse(localStorage.getItem('note'))
  //     if ('images' in note) {
  //       this.setState({ images: note.images })
  //     }
  //   }
  // }

  componentWillReceiveProps = async nextProps => {
    const { firstLoad } = this.state
    if (!firstLoad) return
    const { notes } = nextProps
    notes.forEach(n => {
      const url = n.fullNoteUrl
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const newImage = window.URL.createObjectURL(blob);
          const { note } = n
          const { type } = blob
          const extension = this.getFileExtension(note);
          this.setState(prevState => ({
            firstLoad: false,
            images: [
              ...prevState.images,
              {
                image: newImage,
                file: blob,
                id: `${uuidv4()}.${extension}`,
                loaded: true,
                loading: false,
                error: false,
                type
              }
            ]
          }));
        });
    })

  }

  handleImageDelete = (id: string) => {
    const { imageChange } = this.props
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
    this.setState(newState, imageChange);
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

  compressImage = async file => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    return imageCompression(file, options)
  }

  handleDrop = acceptedFiles => {
    this.setState({ loading: true })
    acceptedFiles.forEach(async file => {
      const compressedFile =
        file.type === 'application/pdf' ? file : await this.compressImage(file)
      const url = URL.createObjectURL(compressedFile);
      const { path, type } = file;
      const extension = this.getFileExtension(path);
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const newImage = window.URL.createObjectURL(blob);
          const { imageChange } = this.props
          this.setState(prevState => ({
            loading: false,
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
          }), imageChange);

          // const { images } = this.state
          // if (localStorage.getItem('note')) {
          //   const currentNote = JSON.parse(localStorage.getItem('note'))
          //   currentNote.images = images
          //   localStorage.setItem('note', JSON.stringify(currentNote))
          // } else {
          //   const note = {
          //     images
          //   }
          //   localStorage.setItem('note', JSON.stringify(note));
          // }
        });
    });
  };

  handleDropRejected = () => {
    this.setState({ loading: false })
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
    const { images } = this.state;
    if (images.length === 0) return [];
    this.setImagesUploading();
    const fileNames = images.map(image => image.id);
    const result = await getPresignedURLs({
      userId,
      type: 3,
      fileNames
    });

    return axios
      .all(
        images.map(async item => {
          const compress = item.file.type === "application/pdf" ? item.file :  await this.compressImage(item.file)
          this.uploadImageRequest(result[item.id].url, compress, item.type)
        })
      )
      .then(
        axios.spread(() => {
          this.setImagesUploaded();
          return images;
        })
      )
      .catch(() => {
        throw new Error('error uploading');
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
    setTimeout(() => this.setState(newState), 4000);
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
    const { images, loading, isDropzoneDisabled } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
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

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UploadImages));
