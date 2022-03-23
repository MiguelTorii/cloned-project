import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import { styles } from '../_styles/AvailableRewards';

import AvailableRewardsItem from './AvailableRewardsItem';

import type { AvailableReward } from 'types/models';

type Props = {
  classes: Record<string, any>;
  rewards: Array<AvailableReward>;
  loading: boolean;
  onClick: (...args: Array<any>) => any;
};

class AvailableRewards extends React.PureComponent<Props> {
  render() {
    const { classes, rewards, loading, onClick } = this.props;

    if (loading) {
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        {rewards.map((item) => (
          <AvailableRewardsItem
            key={item.rewardId}
            rewardId={item.rewardId}
            bgColor={item.bgColor}
            imageUrl={item.imageUrl}
            displayName={item.displayName}
            isSelected={item.isSelected}
            rewardCount={rewards.length}
            onClick={onClick}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles as any)(AvailableRewards);
