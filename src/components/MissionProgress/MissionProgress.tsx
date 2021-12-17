import React from 'react';
import { Box, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import SemiBoldTypography from '../SemiBoldTypography/SemiBoldTypography';
import { useStyles } from './MissionProgressStyles';

type Props = {
  value: number;
  total: number;
};

const StyledLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 48,
    backgroundColor: theme.circleIn.palette.rightPanelCardBackground,
    border: `solid 3px ${theme.circleIn.palette.rightPanelCardBackground}`
  },
  colorPrimary: {},
  bar: {
    height: 14,
    borderRadius: 48,
    background: 'linear-gradient(89.93deg, #2075F5 0.55%, #74ABFF 95.9%)',
    position: 'relative'
  }
}))(LinearProgress);

const MissionProgress = ({ value, total }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <StyledLinearProgress variant="determinate" value={(value * 100) / total} />
      <SemiBoldTypography className={classes.text}>
        {value}/{total}
      </SemiBoldTypography>
    </Box>
  );
};

export default MissionProgress;
