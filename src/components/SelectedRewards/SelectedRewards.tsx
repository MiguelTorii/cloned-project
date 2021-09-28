import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { Slot } from '../../types/models';
import { styles } from '../_styles/SelectedRewards';

const items = [
  {
    key: 1
  },
  {
    key: 2
  },
  {
    key: 3
  }
];

type Props = {
  classes: Record<string, any>;
  slots: Array<Slot>;
  rewardsCount: number;
  loading: boolean;
};

class SelectedRewards extends React.PureComponent<Props> {
  render() {
    const { classes, slots, rewardsCount, loading } = this.props;
    const newItems = items
      .map((item, index) => {
        const slot = slots.find((o) => o.slot === index);

        if (slot) {
          return { ...item, ...slot };
        }

        return item;
      })
      .filter((item) => item.key <= rewardsCount);

    if (loading) {
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {newItems.map((item: any) => (
          <div key={item.key} className={classes.item}>
            <Avatar className={classes.avatar}>{item.key}</Avatar>
            {!item.displayName ? (
              <Typography variant="subtitle1">Select a reward below</Typography>
            ) : (
              <Paper
                className={classes.card}
                style={{
                  backgroundColor: item.bgColor
                }}
              >
                <img src={item.imageUrl} alt={item.displayName} className={classes.image} />
              </Paper>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles as any)(SelectedRewards);
