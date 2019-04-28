// @flow
import React from 'react';
import type { Node } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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

class PostItem extends React.PureComponent<Props> {
  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          {children}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PostItem);
