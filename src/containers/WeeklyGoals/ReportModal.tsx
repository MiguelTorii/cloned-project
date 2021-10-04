import React from "react";
import { Box, Dialog, DialogContent, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import DialogTitle from "../../components/DialogTitle/DialogTitle";
import GradientButton from "../../components/Basic/Buttons/GradientButton";
import useStyles from "./styles";

const ReportModal = ({
  open,
  data,
  onClose,
  value,
  total
}) => {
  const classes = useStyles();
  const remainingPercent = (100 - value * 100.0 / total).toFixed(1);
  return <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle variant="h5" onClose={onClose}>
        <b>{data.title}</b>
      </DialogTitle>
      <DialogContent dividers>
        <Typography>{data.preText(value, total)}</Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <img src={data.image} alt="rocket representing progress" className={classes.reportImage} />
        </Box>
        <Typography paragraph>{data.content(remainingPercent)}</Typography>
        <Box display="flex" justifyContent="flex-end">
          <GradientButton onClick={onClose}>{data.buttonText}</GradientButton>
        </Box>
      </DialogContent>
    </Dialog>;
};

ReportModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  value: PropTypes.number,
  total: PropTypes.number
};
ReportModal.defaultProps = {
  open: false,
  onClose: () => {},
  value: 0,
  total: 3
};
export default ReportModal;