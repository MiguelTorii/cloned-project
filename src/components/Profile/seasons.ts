// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { styles } from '../_styles/Profile/seasons';

type Props = {
  classes: Object,
  seasons: Array<Object>
};

class Seasons extends React.PureComponent<Props, State> {
  render() {
    const { classes, seasons } = this.props;
    const seasonAll = seasons.filter((s) => s.name === 'All');

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Grid
            container
            justifyContent="space-evenly"
            spacing={2}
            className={classes.gridContainer}
            item
            xs={12}
            sm={6}
          >
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].points.toLocaleString()}
              </Typography>
              <Typography variant="h6">Points</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].thanks.toLocaleString()}
              </Typography>
              <Typography variant="h6">Thanks Received</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].bestAnswers.toLocaleString()}
              </Typography>
              <Typography variant="h6">Best Answers</Typography>
            </Grid>
            <Grid item className={classes.data}>
              <Typography variant="h3" gutterBottom>
                {seasonAll[0].reach.toLocaleString()}
              </Typography>
              <Typography variant="h6">Reach</Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Seasons);
