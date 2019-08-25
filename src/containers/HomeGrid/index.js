/* eslint-disable no-empty */
// @flow

import React from 'react';
import { connect } from 'react-redux';
import store from 'store';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
// import Fab from '@material-ui/core/IconButton';
// import ClearIcon from '@material-ui/icons/Clear';
import type { State as StoreState } from '../../types/state';
import type {
  HomeCard,
  DailyStreaksCard as StreaksCard,
  QuestsCard as QuestsCardState,
  CurrentSeasonCard,
  InviteCard
} from '../../types/models';
import type { UserState } from '../../reducers/user';
import {
  getHome,
  getDailyStreaks,
  getQuests,
  getCurrentSeason,
  getInvite
} from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';
import Leaderboard from '../Leaderboard';
import ClassesManager from '../ClassesManager';
import RequestClass from '../RequestClass';
import YourMonthCard from '../../components/YourMonthCard';
import DailyStreaksCard from '../../components/DailyStreaksCard';
import WeeklyStudyPackCard from '../../components/WeeklyStudyPackCard';
import QuestsCard from '../../components/QuestsCard';
import SeasonStatsCard from '../../components/SeasonStatsCard';
import RecommendedPostsCard from '../../components/RecommendedPostsCard';
import InviteYourFriendsCard from '../../components/InviteYourFriendsCard';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  },
  stackbar: {
    backgroundColor: theme.circleIn.palette.snackbar,
    color: theme.circleIn.palette.primaryText1
  },
  grid: {
    padding: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '90%'
    }
  },
  bannerContainer: {
    position: 'relative'
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    borderRadius: 4,
    backgroundColor: theme.circleIn.palette.action,
    width: '100%'
  },
  link: {
    margin: theme.spacing.unit,
    color: theme.palette.primary.main
  },
  banner: {
    color: 'black',
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit
  },
  clear: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1
  }
});

type Props = {
  classes: Object,
  user: UserState,
  enqueueSnackbar: Function
};

type State = {
  homeCard: HomeCard,
  dailyStreaksCard: StreaksCard,
  questsCard: QuestsCardState,
  currentSeasonCard: CurrentSeasonCard,
  inviteCard: InviteCard,
  isHomeCardLoading: boolean,
  isDailyStreaksCardLoading: boolean,
  isQuestsCardLoading: boolean,
  isCurrentSeasonCardLoading: boolean,
  isInviteCardLoading: boolean,
  leaderboard: boolean,
  openRequestClass: boolean,
  manageClasses: boolean
};

class HomeGrid extends React.PureComponent<Props, State> {
  state = {
    homeCard: {
      order: [],
      slots: [],
      subtitle: {
        text: '',
        style: []
      },
      title: ''
    },
    dailyStreaksCard: {
      title: '',
      currentDay: 0,
      hasSeen: false,
      subtitle: {
        text: '',
        style: []
      },
      tiers: []
    },
    questsCard: {
      activeQuests: [],
      availablePointsText: {
        text: '',
        style: []
      },
      progressText: {
        text: '',
        style: []
      }
    },
    currentSeasonCard: {
      seasonId: 0,
      bestAnswers: '',
      grandPrizeText: '',
      logoUrl: '',
      points: '',
      reach: '',
      serviceHours: '',
      thanks: ''
    },
    inviteCard: {
      imageUrl: '',
      referralCode: '',
      subtitle: {
        text: '',
        style: []
      },
      title: ''
    },
    isHomeCardLoading: true,
    isDailyStreaksCardLoading: true,
    isQuestsCardLoading: true,
    isCurrentSeasonCardLoading: true,
    isInviteCardLoading: true,
    leaderboard: false,
    manageClasses: false,
    openRequestClass: false
  };

  componentDidMount = async () => {
    this.mounted = true;
    try {
      const homeCard = await getHome();
      if (this.mounted) this.setState({ homeCard, isHomeCardLoading: false });
      getDailyStreaks()
        .then(result => {
          if (this.mounted)
            this.setState({
              dailyStreaksCard: result,
              isDailyStreaksCardLoading: false
            });
        })
        .catch(() => {
          if (this.mounted) this.setState({ isDailyStreaksCardLoading: false });
        });
      getQuests()
        .then(result => {
          if (this.mounted)
            this.setState({ questsCard: result, isQuestsCardLoading: false });
        })
        .catch(() => {
          if (this.mounted) this.setState({ isQuestsCardLoading: false });
        });
      getCurrentSeason()
        .then(result => {
          if (this.mounted)
            this.setState({
              currentSeasonCard: result,
              isCurrentSeasonCardLoading: false
            });
        })
        .catch(() => {
          if (this.mounted)
            this.setState({ isCurrentSeasonCardLoading: false });
        });
      getInvite()
        .then(result => {
          if (this.mounted)
            this.setState({ inviteCard: result, isInviteCardLoading: false });
        })
        .catch(() => {
          if (this.mounted) this.setState({ isInviteCardLoading: false });
        });
    } finally {
      if (this.mounted) this.setState({ isHomeCardLoading: false });
    }
  };

  componentWillUnmount = () => {
    this.mounted = false;
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

  handleOpenLeaderboard = () => {
    this.setState({ leaderboard: true });
  };

  handleCloseLeaderboard = () => {
    this.setState({ leaderboard: false });
  };

  handleOpenManageClasses = () => {
    this.setState({ manageClasses: true });
  };

  handleCloseManageClasses = () => {
    this.setState({ manageClasses: false });
  };

  handleClearManageClassesBanner = event => {
    event.stopPropagation();
    store.set('MANAGE_CLASSES', true);
    this.forceUpdate();
  };

  handleOpenRequestClass = () => {
    this.handleCloseManageClasses();
    this.setState({ openRequestClass: true });
  };

  handleCloseRequestClass = () => {
    this.setState({ openRequestClass: false });
  };

  mounted: boolean;

  render() {
    const {
      classes,
      user: {
        data: { userId, rank }
      }
    } = this.props;
    const {
      homeCard,
      dailyStreaksCard,
      questsCard,
      currentSeasonCard,
      inviteCard,
      isHomeCardLoading,
      isDailyStreaksCardLoading,
      isQuestsCardLoading,
      isCurrentSeasonCardLoading,
      isInviteCardLoading,
      leaderboard,
      manageClasses,
      openRequestClass
    } = this.state;

    return (
      <div className={classes.root}>
        <ErrorBoundary>
          <Grid container spacing={8} className={classes.grid}>
            <Grid
              item
              xs={12}
              hidden={false}
              className={classes.bannerContainer}
            >
              <ButtonBase
                className={classes.paper}
                onClick={this.handleOpenManageClasses}
                disableRipple
              >
                <Typography className={classes.banner} align="center">
                  Hey! You’re one of the lucky students with access to CircleIn
                  for one or more of your courses this year. View those courses
                  by clicking{' '}
                  <span style={{ fontWeight: 'bolder', fontSize: 16 }}>
                    here!
                  </span>
                </Typography>
              </ButtonBase>
            </Grid>
            <Grid item xs={12}>
              <YourMonthCard
                data={homeCard}
                rank={rank}
                isLoading={isHomeCardLoading}
                onOpenLeaderboard={this.handleOpenLeaderboard}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DailyStreaksCard
                data={dailyStreaksCard}
                isLoading={isDailyStreaksCardLoading}
              />
            </Grid>
            <Grid item xs={12} md={6} hidden>
              <WeeklyStudyPackCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuestsCard
                userId={userId}
                data={questsCard}
                isLoading={isQuestsCardLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SeasonStatsCard
                data={currentSeasonCard}
                isLoading={isCurrentSeasonCardLoading}
              />
            </Grid>
            <Grid item xs={12} md={6} hidden>
              <RecommendedPostsCard isLoading={isHomeCardLoading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InviteYourFriendsCard
                data={inviteCard}
                isLoading={isInviteCardLoading}
                onCopy={this.handleCopy}
              />
            </Grid>
          </Grid>
        </ErrorBoundary>
        <ErrorBoundary>
          <Leaderboard
            open={leaderboard}
            onClose={this.handleCloseLeaderboard}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <ClassesManager
            open={manageClasses}
            onClose={this.handleCloseManageClasses}
            onOpenRequestClass={this.handleOpenRequestClass}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <RequestClass
            open={openRequestClass}
            onClose={this.handleCloseRequestClass}
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
