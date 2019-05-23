// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { AvailableReward } from '../../types/models';
import Item from './item';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
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
  rewards: Array<AvailableReward>,
  loading: boolean,
  onClick: Function
};

class AvailableRewards extends React.PureComponent<Props> {
  render() {
    const { classes, rewards, loading, onClick } = this.props;

    if (loading)
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );

    return (
      <div className={classes.root}>
        {rewards.map(item => (
          <Item
            key={item.rewardId}
            rewardId={item.rewardId}
            bgColor={item.bgColor}
            imageUrl={item.imageUrl}
            displayName={item.displayName}
            isSelected={item.isSelected}
            onClick={onClick}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(AvailableRewards);
