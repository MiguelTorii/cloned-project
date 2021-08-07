import React, { useMemo } from 'react';
import { Box, Dialog, DialogContent, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import DialogTitle from '../../components/DialogTitle';
import ModalData from './mid-week-report-data';
import GradientButton from '../../components/Basic/Buttons/GradientButton';
import useStyles from './styles';

const MidWeekReportModal = ({ open, onClose, value, total }) => {
  const classes = useStyles();
  const percent = useMemo(() => value * 100 / total, [value, total]);
  const data = useMemo(() => {
    if (percent < 50) return ModalData[0];
    if (percent < 100) return ModalData[1];
    return ModalData[2]
  }, [percent]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <DialogTitle variant="h5" onClose={onClose}>
        <b>Your Mid-Week Report</b>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" justifyContent="center" mb={2}>
          <img src={data.image} alt="rocket representing progress" className={classes.reportImage}/>
        </Box>
        <Typography paragraph>
          {data.content(100 - percent)}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <GradientButton onClick={onClose}>
            {data.buttonText}
          </GradientButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

MidWeekReportModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  value: PropTypes.number,
  total: PropTypes.number
};

MidWeekReportModal.defaultProps = {
  open: false,
  onClose: () => {},
  value: 0,
  total: 3
};

export default MidWeekReportModal;
