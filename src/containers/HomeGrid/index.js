// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import type { State as StoreState } from '../../types/state';
import type { HomeCards } from '../../types/models';
import type { UserState } from '../../reducers/user';
import HomeGridList from '../../components/HomeGridList';
import Leaderboard from '../Leaderboard';
import { getHome } from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';

const styles = () => ({});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  cards: HomeCards,
  loading: boolean,
  leaderboard: boolean
};

class HomeGrid extends React.PureComponent<Props, State> {
  state = {
    cards: [],
    loading: true,
    leaderboard: false
  };

  componentDidMount = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    try {
      const cards = await getHome({ userId });
      this.setState({ cards });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleOpenLeaderboard = () => {
    this.setState({ leaderboard: true });
  };

  handleCloseLeaderboard = () => {
    this.setState({ leaderboard: false });
  };

  render() {
    const { classes } = this.props;
    const { cards, loading, leaderboard } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <HomeGridList
            cards={cards}
            loading={loading}
            onOpenLeaderboard={this.handleOpenLeaderboard}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Leaderboard
            open={leaderboard}
            onClose={this.handleCloseLeaderboard}
          />
        </ErrorBoundary>
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
)(withStyles(styles)(HomeGrid));
