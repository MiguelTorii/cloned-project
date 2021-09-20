// @flow

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import type { State as StoreState } from 'types/state';
import { connect } from 'react-redux';
import Dnd from './dnd';
import { getRewards, updateRewards } from '../../api/store';
import type { UserState } from '../../reducers/user';

type Props = {
  user: UserState
};

const OnboardSelectRewards = ({ user }: Props) => {
  const [rewards, setRewards] = useState([]);
  const {
    data: { userId }
  } = user;

  useEffect(() => {
    const fetchRewards = async () => {
      const { availableRewards } = await getRewards({ userId });
      if (availableRewards) setRewards(availableRewards);
    };
    fetchRewards();
  }, [userId]);

  const saveReward = (name, slot) => {
    const { rewardId } = rewards.find((el) => el.displayName === name);
    if (rewardId) updateRewards({ userId, rewardId, slot });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Dnd saveReward={saveReward} />
    </DndProvider>
  );
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(mapStateToProps, null)(OnboardSelectRewards);
