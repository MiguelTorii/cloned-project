// @flow

import React, { Fragment } from 'react';
import fetch from 'isomorphic-fetch';
import cx from 'classnames';
import AvatarEditor from 'react-avatar-editor';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DoneIcon from '@material-ui/icons/Done';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';

import Dialog from 'components/Dialog';
import GradientButton from 'components/Basic/Buttons/GradientButton';

import { styles } from '../_styles/EditPhotoThumbnail';


type Props = {
  classes: Object,
  id: string,
  image: string,
  loaded: boolean,
  loading: boolean,
  error: boolean,
  onSave: Function,
  onDelete: Function,
  onImageRetry: Function
};

type State = {
  open: boolean,
  zoom: number,
  rotate: number
};

class EditPhotoThumbnail extends React.PureComponent<Props, State> {
  state = {
    open: false,
    zoom: 1,
    rotate: 0
  };

  setEditorRef = editor => {
    this.editor = editor;
  };

  handleDelete = () => {
    const { onDelete, id } = this.props;
    onDelete(id);
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, zoom: 1, rotate: 0 });
  };

  handleSave = async () => {
    const { id, onSave } = this.props;
    if (this.editor) {
      // $FlowIgnore
      const canvas = this.editor.getImage().toDataURL();
      fetch(canvas)
        .then(res => res.blob())
        .then(blob => {
          const newImage = window.URL.createObjectURL(blob);
          onSave(id, newImage);
          this.handleClose();
        });
    }
  };

  handleImageRetry = () => {
    const { id, onImageRetry } = this.props;
    onImageRetry(id);
  };

  handleZoomIn = () => {
    this.setState(prevState => ({
      zoom: prevState.zoom + 0.1 > 3 ? 3 : prevState.zoom + 0.1
    }));
  };

  handleZoomOut = () => {
    this.setState(prevState => ({
      zoom: prevState.zoom - 0.1 < 0 ? 0 : prevState.zoom - 0.1
    }));
  };

  handleRotateRight = () => {
    this.setState(prevState => ({ rotate: prevState.rotate + 45 }));
  };

  handleRotateLeft = () => {
    this.setState(prevState => ({ rotate: prevState.rotate - 45 }));
  };

  renderCreateIcon = () => {
    const { classes, loaded } = this.props;
    if (loaded)
      return (
        <DoneIcon
          className={cx(classes.icon, classes.green)}
          fontSize="small"
        />
      );
    return <CreateIcon className={classes.icon} fontSize="small" />;
  };

  // eslint-disable-next-line no-undef
  editor: ?HTMLDivElement;

  render() {
    const { classes, image, loaded, loading, type, error } = this.props;
    const { open, zoom, rotate } = this.state;

    return (
      <Fragment>
        <Paper
          className={cx(
            classes.root,
            (loaded || loading) && classes.reverse,
            error && classes.error
          )}
          elevation={8}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              opacity: loaded || loading || error ? 0.5 : 1,
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {loading && <CircularProgress />}
          </div>
          <div className={classes.action}>
            <IconButton
              aria-label="Edit"
              disabled={loaded || loading}
              className={cx(classes.button, type === 'application/pdf' && classes.hide)}
              onClick={this.handleOpen}
            >
              {this.renderCreateIcon()}
            </IconButton>
            <IconButton
              aria-label="Delete"
              disabled={loading}
              className={classes.button}
              onClick={this.handleDelete}
            >
              <ClearIcon className={classes.icon} fontSize="small" />
            </IconButton>
          </div>
          {loaded && (
            <div className={classes.uploaded}>
              <CloudUploadIcon className={classes.uploadedIcon} />
              <Typography variant="subtitle2" align="center">
                Image Uploaded
              </Typography>
            </div>
          )}
          {error && (
            <div className={classes.retry}>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={this.handleImageRetry}
              >
                Retry
              </Button>
            </div>
          )}
        </Paper>
        <Dialog
          title="Edit Image"
          className={clsx(
            classes.modalRoot,
            !image && classes.hidden
          )}
          open={open}
          onCancel={this.handleClose}
        >
          <div className={classes.editor}>
            <AvatarEditor
              ref={this.setEditorRef}
              image={image}
              width={250}
              height={250}
              border={10}
              scale={zoom}
              rotate={rotate}
            />
            <div className={classes.actions}>
              <IconButton
                color="inherit"
                disabled={zoom >= 3}
                onClick={this.handleZoomIn}
                aria-label="Zoom In"
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                color="inherit"
                disabled={zoom <= 0}
                onClick={this.handleZoomOut}
                aria-label="Zoom Out"
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={this.handleRotateLeft}
                aria-label="Rotate Left"
              >
                <RotateLeftIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={this.handleRotateRight}
                aria-label="Rotate Right"
              >
                <RotateRightIcon />
              </IconButton>
            </div>
            <GradientButton
              compact
              onClick={this.handleSave}
              style={{ width: '100%' }}
            >
              Save changes <span role='img' aria-label='tada'>🎉</span>
            </GradientButton>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(EditPhotoThumbnail);
