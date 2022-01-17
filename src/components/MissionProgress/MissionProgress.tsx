import React, { useCallback } from 'react';
import { Box, LinearProgress, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import lodash from 'lodash';
import SemiBoldTypography from '../SemiBoldTypography/SemiBoldTypography';
import { useStyles } from './MissionProgressStyles';

type Props = {
  value: number;
  total: number;
  label: string;
  link: string;
};

const StyledLinearProgress = withStyles((theme) => ({
  root: {
    height: 16,
    borderRadius: 16
  },
  colorPrimary: {
    backgroundColor: theme.circleIn.palette.expBarBackground
  },
  bar: {
    borderRadius: 16,
    backgroundColor: theme.circleIn.palette.darkActionBlue
  }
}))(LinearProgress);

const MissionProgress = ({ value, total, label, link }: Props) => {
  const classes = useStyles();

  const handleClickProgress = useCallback(() => {
    window.open(link);
  }, [link]);

  return (
    <Tooltip
      title={`${value.toLocaleString()}/${total.toLocaleString()} ${label}`}
      arrow
      placement="right"
    >
      <Box className={classes.root} onClick={handleClickProgress}>
        <StyledLinearProgress
          variant="determinate"
          value={lodash.min([(value * 100) / total, 100])}
        />
        <Box className={classes.textContainer}>
          <SemiBoldTypography className={classes.text}>
            {value.toLocaleString()}/{total.toLocaleString()}
          </SemiBoldTypography>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default MissionProgress;
