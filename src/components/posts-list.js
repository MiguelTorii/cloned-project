// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  }
});

type Props = {
  classes: Object
};

class PostsList extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Typography variant="h6" gutterBottom>
            Top Posts
          </Typography>
          <Card className={classes.card} elevation={1}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Nothing yet
              </Typography>
            </CardContent>
          </Card>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PostsList);
