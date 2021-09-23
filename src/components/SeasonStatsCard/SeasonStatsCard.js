// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { CurrentSeasonCard } from '../../types/models';
import { styles } from '../_styles/SeasonStatsCard';

type Props = {
  classes: Object,
  data: CurrentSeasonCard,
  isLoading: boolean
};

type State = {};

class SeasonStatsCard extends React.PureComponent<Props, State> {
  state = {};

  render() {
    const { classes, data, isLoading } = this.props;

    if (isLoading) {
return (
        <Paper className={classes.root} elevation={1}>
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        </Paper>
      );
}

    const options = [
      { label: 'Thanks', value: data.thanks },
      { label: 'Reach', value: data.reach },
      { label: 'Best Answers', value: data.bestAnswers },
      { label: 'Points', value: data.points },
      { label: 'Service Hours', value: data.serviceHours }
    ];

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Season Stats
        </Typography>
        <div className={classes.stats}>
          {options.map((item) => (
            <div key={item.label} className={classes.stat}>
              <Typography variant="subtitle1" align="center">
                {item.value}
              </Typography>
              <Typography variant="caption" align="center">
                {item.label}
              </Typography>
            </div>
          ))}
        </div>
        <div className={classes.grandPrize}>
          <img className={classes.image} alt="Prize" src={data.logoUrl} />
          <div className={classes.texts}>
            <Typography variant="h5" className={classes.title}>
              Season Grand Prize
            </Typography>
            <Typography variant="h6">{data.grandPrizeText}</Typography>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(SeasonStatsCard);
