// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object
};

type State = {};

class FeedItem extends React.PureComponent<Props, State> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container className={classes.root} spacing={16}>
          {[
            { id: 0, cols: 12, title: 'first tile' },
            { id: 1, cols: 6, title: 'second tile' },
            { id: 2, cols: 6, title: 'third tile' },
            { id: 3, cols: 6, title: 'fourth tile' },
            { id: 4, cols: 6, title: 'fifth tile' }
          ].map(tile => (
            <Grid key={tile.id} item xs={tile.cols}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h5" component="h3">
                  {tile.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(FeedItem);
