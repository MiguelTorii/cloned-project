import React, { Fragment } from 'react';

import cx from 'classnames';
import clsx from 'clsx';
import fetch from 'isomorphic-fetch';
import AvatarEditor from 'react-avatar-editor';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import { styles } from '../_styles/EditPhotoThumbnail';
import GradientButton from '../Basic/Buttons/GradientButton';
import Dialog from '../Dialog/Dialog';

type Props = {
  classes?: Record<string, any>;
  id?: string;
  image?: string;
  loaded?: boolean;
  loading?: boolean;
  error?: boolean;
  type?: any;
  onSave?: (...args: Array<any>) => any;
  onDelete?: (...args: Array<any>) => any;
  onImageRetry?: (...args: Array<any>) => any;
};

type State = {
  open: boolean;
  zoom: number;
  rotate: number;
};

class EditPhotoThumbnail extends React.PureComponent<Props, State> {
  state = {
    open: false,
    zoom: 1,
    rotate: 0
  };

  // eslint-disable-next-line no-undef
  editor: HTMLDivElement | null | undefined;

  setEditorRef = (editor) => {
    this.editor = editor;
  };

  handleDelete = () => {
    const { onDelete, id } = this.props;
    onDelete(id);
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      zoom: 1,
      rotate: 0
    });
  };

  handleSave = async () => {
    const { id, onSave } = this.props;

    if (this.editor) {
      const canvas = (this.editor as any).getImage().toDataURL();
      fetch(canvas)
        .then((res) => res.blob())
        .then((blob) => {
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
    this.setState((prevState) => ({
      zoom: prevState.zoom + 0.1 > 3 ? 3 : prevState.zoom + 0.1
    }));
  };

  handleZoomOut = () => {
    this.setState((prevState) => ({
      zoom: prevState.zoom - 0.1 < 0 ? 0 : prevState.zoom - 0.1
    }));
  };

  handleRotateRight = () => {
    this.setState((prevState) => ({
      rotate: prevState.rotate + 45
    }));
  };

  handleRotateLeft = () => {
    this.setState((prevState) => ({
      rotate: prevState.rotate - 45
    }));
  };

  renderCreateIcon = () => {
    const { classes, loaded } = this.props;

    if (loaded) {
      return <DoneIcon className={cx(classes.icon, classes.green)} fontSize="small" />;
    }

    return <CreateIcon className={classes.icon} fontSize="small" />;
  };

  render() {
    const { classes, image, loaded, loading, type, error } = this.props;
    const { open, zoom, rotate } = this.state;
    return (
      <>
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
          className={clsx(classes.modalRoot, !image && classes.hidden)}
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
              <IconButton color="inherit" onClick={this.handleRotateLeft} aria-label="Rotate Left">
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
              style={{
                width: '100%'
              }}
            >
              Save changes{' '}
              <span role="img" aria-label="tada">
                🎉
              </span>
            </GradientButton>
          </div>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles as any)(EditPhotoThumbnail);
