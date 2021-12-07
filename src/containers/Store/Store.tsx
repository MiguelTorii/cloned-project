import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import type { UserState } from '../../reducers/user';
import type { AvailableReward, Slot } from '../../types/models';
import { getRewards, updateRewards } from '../../api/store';
import StoreLayout from '../../components/StoreLayout/StoreLayout';
import SelectedRewards from '../../components/SelectedRewards/SelectedRewards';
import AvailableRewards from '../../components/AvailableRewards/AvailableRewards';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { User } from '../../types/models';

const styles = (theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
});

type Props = {
  classes?: Record<string, any>;
};

const Store = ({ classes }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [availableRewards, setAvailableRewards] = useState<AvailableReward[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const user: User = useSelector((state: { user: UserState }) => state.user.data);

  const userId = user?.userId;

  const handleFetchRewardsInternal: any = async () => {
    if (userId) {
      if (mounted) {
        setLoading(true);
      }

      try {
        const { availableRewards, slots } = await getRewards({
          userId
        });

        if (mounted) {
          setAvailableRewards(availableRewards);
          setSlots(slots);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    } else {
      handleFetchRewardsInternal();
    }
  };

  const handleSelection = async ({ rewardId, slot }: { rewardId: number; slot: number }) => {
    setLoading(true);

    try {
      await updateRewards({
        userId,
        rewardId,
        slot
      });
      handleFetchRewardsInternal();
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('offline', () => {
      if (
        handleFetchRewardsInternal.cancel &&
        typeof handleFetchRewardsInternal.cancel === 'function'
      ) {
        handleFetchRewardsInternal.cancel();
      }
    });
    window.addEventListener('online', () => {
      handleFetchRewardsInternal();
    });
    setMounted(true);
    const handleFetchRewards = debounce(handleFetchRewardsInternal, 250);
    handleFetchRewards();

    return () => {
      setMounted(false);

      if (
        handleFetchRewardsInternal.cancel &&
        typeof handleFetchRewardsInternal.cancel === 'function'
      ) {
        handleFetchRewardsInternal.cancel();
      }
    };
  }, [mounted]);

  return (
    <StoreLayout>
      <ErrorBoundary>
        <SelectedRewards slots={slots} loading={loading} rewardsCount={availableRewards.length} />
      </ErrorBoundary>
      <Divider light className={classes.divider} />
      <ErrorBoundary>
        <AvailableRewards rewards={availableRewards} loading={loading} onClick={handleSelection} />
      </ErrorBoundary>
    </StoreLayout>
  );
};

export default withStyles(styles as any)(Store);
