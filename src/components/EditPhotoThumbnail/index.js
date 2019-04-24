// @flow

import React, { Fragment } from 'react';
import fetch from 'isomorphic-fetch';
import cx from 'classnames';
import AvatarEditor from 'react-avatar-editor';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DoneIcon from '@material-ui/icons/Done';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
  root: {
    // margin: theme.spacing.unit * 2,
    backgroundColor: 'white',
    color: 'black',
    position: 'relative',
    width: 100,
    height: 130
  },
  reverse: {
    backgroundColor: 'black'
  },
  error: {
    backgroundColor: red[500]
  },
  preview: {
    width: '100%',
    height: '100%'
  },
  action: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing.unit
  },
  uploaded: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit
  },
  retry: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit
  },
  button: {
    padding: 4,
    backgroundColor: theme.circleIn.customBackground.iconButton
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  editor: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  actions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit
  },
  green: {
    color: green[500]
  },
  uploadedIcon: {
    opacity: 0.5
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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
    const { classes, image, loaded, loading, error } = this.props;
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
              className={classes.button}
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
          fullScreen
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.flex}>
                Edit Image
              </Typography>
              <Button
                color="inherit"
                variant="contained"
                onClick={this.handleSave}
              >
                save
              </Button>
            </Toolbar>
          </AppBar>
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
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(EditPhotoThumbnail);
