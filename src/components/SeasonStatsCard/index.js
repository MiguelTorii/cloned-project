// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '100%'
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing.unit,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: 70,
    height: 75,
    borderRadius: 8,
    '-moz-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    '-webkit-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    boxShadow: 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)'
  },
  grandPrize: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: '100%',
    borderRadius: 8,
    '-moz-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    '-webkit-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    boxShadow: 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)'
  },
  image: {
    width: 76,
    height: 76,
    margin: theme.spacing.unit,
    backgroundColor: 'white',
    borderRadius: 8
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing.unit
  },
  title: {
    fontWeight: 'bold'
  }
});

type Props = {
  classes: Object,
  thanks?: string,
  reach?: string,
  bestAnswers?: string,
  points?: string,
  serviceHours?: string
};

type State = {};

class SeasonStatsCard extends React.PureComponent<Props, State> {
  static defaultProps = {
    thanks: '0',
    reach: '0',
    bestAnswers: '0',
    points: '0',
    serviceHours: '0'
  };

  state = {};

  render() {
    const {
      classes,
      thanks,
      reach,
      bestAnswers,
      points,
      serviceHours
    } = this.props;
    const options = [
      { label: 'Thanks', value: thanks },
      { label: 'Reach', value: reach },
      { label: 'Best Answers', value: bestAnswers },
      { label: 'Points', value: points },
      { label: 'Service Hours', value: serviceHours }
    ];

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h4" paragraph>
          Season Stats
        </Typography>
        <div className={classes.stats}>
          {options.map(item => (
            <div key={item.label} className={classes.stat}>
              <Typography variant="h6" align="center">
                {item.value}
              </Typography>
              <Typography variant="subtitle1" align="center">
                {item.label}
              </Typography>
            </div>
          ))}
        </div>
        <div className={classes.grandPrize}>
          <div className={classes.image} />
          <div className={classes.texts}>
            <Typography variant="h6" className={classes.title}>
              Season Grand Prize
            </Typography>
            <Typography variant="subtitle1">
              Check back here to find out the season grand prize!
            </Typography>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(SeasonStatsCard);
