import React, { useMemo } from 'react';
import withRoot from '../../withRoot';
import type { PointsHistoryItem } from '../../types/models';
import Paper from '@material-ui/core/Paper';
import { Box } from '@material-ui/core';
import LoadImg from '../LoadImg';
import Typography from '@material-ui/core/Typography';
import { momentWithTimezone } from '../../utils/helpers';
import moment from 'moment';

import { useStyles } from '../_styles/PointsRecordItem';
const IMAGE_SIZE = 32;

type Props = {
  data: PointsHistoryItem
}

const PointsRecordItem = ({ data }: Props) => {
  const classes = useStyles();
  const durationText = useMemo(() => {
    const minutes = moment.duration(
      momentWithTimezone().diff(momentWithTimezone(data.date))
    ).asMinutes();

    if (minutes < 60) return moment.duration(-minutes, 'minutes').humanize(true);
    if (minutes < 60 * 24) return moment.duration(-minutes / 60, 'hours').humanize(true);
    return moment.duration(-minutes / 1440, 'days').humanize(true);
  }, [data]);

  return (
    <Paper className={classes.root}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <LoadImg
            url={data.points_icon_url}
            loadingSize={IMAGE_SIZE}
            className={classes.image}
          />
          <div>
            <Typography>
              { data.points_title }
            </Typography>
            <Typography variant="body1">
              { durationText }
            </Typography>
          </div>
        </Box>
        <Typography variant="body1" align="right">
          { data.points.toString().toUpperCase() } <br/> Points
        </Typography>
      </Box>
    </Paper>
  );
};

export default withRoot(PointsRecordItem);