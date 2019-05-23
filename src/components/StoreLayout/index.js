// @flow
import React from 'react';
import type { Node } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  }
});

type Props = {
  classes: Object,
  children: Node
};

class StoreLayout extends React.PureComponent<Props> {
  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <Typography variant="h3" paragraph>
            Welcome to the Rewards Store
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Whenever you share something useful on CircleIn or help a classmate,
            you’ll earn points. As your points add up, at the end of every
            month, you’ll have a chance to win our monthly reward. Select three
            rewards below and if you’re selected as a winner, we’ll send you an
            e-giftcard for one of your choices!
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Your Monthly Rewards Selections
          </Typography>
          {children}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(StoreLayout);
