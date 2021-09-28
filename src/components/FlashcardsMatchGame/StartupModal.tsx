import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import withRoot from '../../withRoot';
import Dialog from '../Dialog/Dialog';
import GradientButton from '../Basic/Buttons/GradientButton';
import ImgBook from '../../assets/gif/magic-book.gif';
import useStyles from './styles';

const StartupModal = ({ open, onClose, onStart }) => {
  const classes: any = useStyles();
  return (
    <Dialog
      className={classes.startupModal}
      open={open}
      onCancel={onClose}
      title="Welcome to Match Magic Game!"
    >
      <Box>
        <Box display="flex" justifyContent="center" pt={3} mb={3}>
          <img src={ImgBook} alt="Magic Book" className={classes.modalGif} />
        </Box>
        <Typography variant="h5" align="center" paragraph>
          Make all the cards disappear like magic!
        </Typography>
        <Typography align="center" paragraph>
          Click and drag the corresponding cards onto each other to make them disappear.
        </Typography>
        <Box display="flex" justifyContent="center">
          <GradientButton onClick={onStart}>
            Start Game&nbsp;
            <span role="img" aria-label="Rocket">
              🚀
            </span>
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
};

StartupModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onStart: PropTypes.func
};
StartupModal.defaultProps = {
  open: false,
  onClose: () => {},
  onStart: () => {}
};
export default withRoot(StartupModal);
