// @flow

import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { AvailableReward, Slot } from '../../types/models';
import { getRewards, updateRewards } from '../../api/store';
import StoreLayout from '../../components/StoreLayout';
import SelectedRewards from '../../components/SelectedRewards';
import AvailableRewards from '../../components/AvailableRewards';

const styles = theme => ({
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  availableRewards: Array<AvailableReward>,
  slots: Array<Slot>,
  loading: boolean
};

class Store extends React.PureComponent<Props, State> {
  state = {
    availableRewards: [],
    slots: [],
    loading: false
  };

  componentDidMount = () => {
    this.handleFetchRewards = debounce(this.handleFetchRewards, 250);
    this.handleFetchRewards();
  };

  handleFetchRewards = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    if (userId !== '') {
      this.setState({ loading: true });
      try {
        const { availableRewards, slots } = await getRewards({ userId });
        this.setState({ availableRewards, slots });
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.handleFetchRewards();
    }
  };

  handleSelection = async ({
    rewardId,
    slot
  }: {
    rewardId: number,
    slot: number
  }) => {
    this.setState({ loading: true });
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    try {
      await updateRewards({ userId, rewardId, slot });
      this.handleFetchRewards();
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { classes } = this.props;
    const { availableRewards, slots, loading } = this.state;

    return (
      <div className={classes.root}>
        <StoreLayout>
          <SelectedRewards slots={slots} loading={loading} />
          <Divider light className={classes.divider} />
          <AvailableRewards
            rewards={availableRewards}
            loading={loading}
            onClick={this.handleSelection}
          />
        </StoreLayout>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Store));