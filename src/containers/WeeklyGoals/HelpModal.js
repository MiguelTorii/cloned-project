import React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';
import IconClose from '@material-ui/icons/Close';

import StudyGoals from 'constants/study-goals';
import useStyles from './styles';
import GradientButton from '../../components/Basic/Buttons/GradientButton';

const HelpModal = ({ open, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography className={classes.helpTitle} align="center" paragraph>
          What are Weekly Study Goals?
        </Typography>
        <Typography>
          These Weekly Study Goals are here to help you establish
          healthy studying habits and achieve academic success!
          <span role="img" aria-labelledby="rocket">🚀</span>
          <br/>
          Read below to learn how to achieve each goal!
        </Typography>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <IconClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.helpModalContent}>
        <Box className={classes.modalContentData}>
          <Grid container direction="column" spacing={3}>
            {StudyGoals.map((item) => (
              <Grid key={item.id} item sm={12}>
                <Typography className={classes.goalTitle} gutterBottom>
                  {item.title}
                </Typography>
                <Typography className={classes.goalDescription}>
                  {item.description}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className={classes.helpModalActions}>
        <GradientButton onClick={onClose}>
          <span role="img" aria-label="target">
            🎯
          </span>
          &nbsp;&nbsp;<b>Yay goals!</b>
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

HelpModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

HelpModal.defaultProps = {
  open: false,
  onClose: () => {}
};

export default HelpModal;
