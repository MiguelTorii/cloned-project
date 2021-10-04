import React from "react";
import { Paper, Typography } from "@material-ui/core";
import withRoot from "../../withRoot";
import { useStyles } from "../_styles/PointsHistoryDetails/PointsReport";
type Props = {
  userId: number;
  isMyProfile: boolean;
  displayName: string;
};

const PointsReport = ({
  userId,
  isMyProfile,
  displayName
}: Props) => {
  const classes = useStyles();
  return <Paper className={classes.root}>
      <Typography variant="h6">
        {isMyProfile ? 'Your' : `${displayName}'s`} Points Report
      </Typography>
    </Paper>;
};

export default withRoot(PointsReport);