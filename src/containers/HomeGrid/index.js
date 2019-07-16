// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import type { State as StoreState } from '../../types/state';
import type { HomeCards } from '../../types/models';
import type { UserState } from '../../reducers/user';
import HomeGridList from '../../components/HomeGridList';
import Leaderboard from '../Leaderboard';
import { getHome } from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  enqueueSnackbar: Function
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
    this.mounted = true;

    const {
      user: {
        data: { userId }
      }
    } = this.props;
    try {
      const cards = await getHome({ userId });
      if (this.mounted) this.setState({ cards });
    } finally {
      if (this.mounted) this.setState({ loading: false });
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleOpenLeaderboard = () => {
    this.setState({ leaderboard: true });
  };

  handleCloseLeaderboard = () => {
    this.setState({ leaderboard: false });
  };

  handleCopy = () => {
    const { enqueueSnackbar, classes } = this.props;
    enqueueSnackbar('Referral code copied to Clipboard', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      autoHideDuration: 3000,
      ContentProps: {
        classes: {
          root: classes.stackbar
        }
      }
    });
  };

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        data: { userId, referralCode }
      }
    } = this.props;
    const { cards, loading, leaderboard } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <HomeGridList
            userId={userId}
            referralCode={referralCode}
            cards={cards}
            loading={loading}
            onOpenLeaderboard={this.handleOpenLeaderboard}
            onCopy={this.handleCopy}
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
)(withStyles(styles)(withSnackbar(HomeGrid)));
