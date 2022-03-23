import React from 'react';

import { Box, Tooltip, Typography } from '@material-ui/core';
import IconInformation from '@material-ui/icons/InfoOutlined';

import MissionProgress from 'components/MissionProgress/MissionProgress';

import { useStyles } from './HudMissionsStyles';

import type { TMission } from 'types/models';

type Props = {
  data: TMission;
};

const HudMission = ({ data }: Props) => {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center">
      <Box className={classes.imageContainer} mr={1}>
        <img className={classes.image} src={data.icon_url} alt={data.title} />
      </Box>
      <Box flexGrow={1}>
        <Typography className={classes.missionText}>{data.title}</Typography>
        <MissionProgress
          value={data.numerator}
          total={data.denominator}
          label={data.label}
          link={data.link}
        />
      </Box>
    </Box>
  );
};

export default HudMission;
