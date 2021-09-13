import React, { useCallback } from 'react';
import SlideUp from 'components/Transition/SlideUp';
import Dialog from 'components/Dialog/Dialog';
import PropTypes from 'prop-types';
import useStyles from './styles';
import Box from '@material-ui/core/Box';
import LoadImg from 'components/LoadImg/LoadImg';
import IconClose from '@material-ui/icons/Close';

const ImageDialog = ({ open, imageUrl, onClose }) => {
  const classes = useStyles();

  const handleClickBox = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCloseImage = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <Dialog
      fullScreen
      className={classes.modalContainer}
      contentClassName={classes.modalContent}
      open={open}
      onCancel={onClose}
      showHeader={false}
      TransitionComponent={SlideUp}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.imageContainer}
        onClick={handleClickBox}
      >
        <Box position="relative" onClick={handleCloseImage}>
          <LoadImg url={imageUrl} className={classes.image} />
          <IconClose className={classes.closeIcon} onClick={onClose} />
        </Box>
      </Box>
    </Dialog>
  );
};

ImageDialog.propTypes = {
  open: PropTypes.bool,
  imageUrl: PropTypes.string,
  onClose: PropTypes.func
};

ImageDialog.defaultProps = {
  open: false,
  imageUrl: '',
  onClose: () => {}
};

export default ImageDialog;
