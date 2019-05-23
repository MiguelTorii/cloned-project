// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { Slot } from '../../types/models';

const items = [{ key: 1 }, { key: 2 }, { key: 3 }];

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    margin: theme.spacing.unit,
    display: 'flex'
  },
  avatar: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.primary.main,
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit
  },
  card: {
    width: 140,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 'auto',
    maxWidth: 120,
    height: 'auto',
    maxHeight: 80
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  slots: Array<Slot>,
  loading: boolean
};

class SelectedRewards extends React.PureComponent<Props> {
  render() {
    const { classes, slots, loading } = this.props;
    const newItems = items.map((item, index) => {
      const slot = slots.find(o => o.slot === index);
      if (slot) return { ...item, ...slot };
      return item;
    });

    if (loading)
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );

    return (
      <div className={classes.root}>
        {newItems.map(item => (
          <div key={item.key} className={classes.item}>
            <Avatar className={classes.avatar}>{item.key}</Avatar>
            {!item.displayName ? (
              <Typography variant="subtitle1">Select a reward below</Typography>
            ) : (
              <Paper className={classes.card}>
                <img
                  src={item.imageUrl}
                  alt={item.displayName}
                  className={classes.image}
                />
              </Paper>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(SelectedRewards);
