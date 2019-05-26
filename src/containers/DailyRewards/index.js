// @flow

import React from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { DailyRewards as DailyRewardsState } from '../../types/models';
import { getDailyRewards } from '../../api/user';
import coin1 from '../../assets/svg/coin_1.svg';
import coin2 from '../../assets/svg/coin_2.svg';
import coin3 from '../../assets/svg/coin_3.svg';
import coin4 from '../../assets/svg/coin_4.svg';
import coin5 from '../../assets/svg/coin_5.svg';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';
import ErrorBoundary from '../ErrorBoundary';

const ranks = [
  { label: 'Bronze', value: bronze },
  { label: 'Silver', value: silver },
  { label: 'Gold', value: gold },
  { label: 'Platinum', value: platinum },
  { label: 'Diamond', value: diamond },
  { label: 'Master', value: master }
];

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    width: 360
  },
  opacity: {
    opacity: 0.3
  },
  itemIcon: {
    width: 100,
    display: 'flex',
    justifyContent: 'center'
  },
  coin: {
    height: 30
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rank: {
    margin: theme.spacing.unit,
    height: 60
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  dailyRewards: DailyRewardsState,
  open: boolean
};

class DailyRewards extends React.PureComponent<Props, State> {
  state = {
    dailyRewards: { givenPoints: 0, pointsLeft: 0, stage: 0 },
    open: false
  };

  componentDidMount = () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    this.handleGetDailyRewards = debounce(this.handleGetDailyRewards, 600233, {
      leading: true
    });
    if (userId !== '') this.handleGetDailyRewards();
  };

  componentDidUpdate = prevProps => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    const {
      user: {
        data: { userId: prevUserId }
      }
    } = prevProps;

    if (userId !== '' && prevUserId === '') this.handleGetDailyRewards();
  };

  handleGetDailyRewards = async () => {
    try {
      const {
        user: {
          data: { userId }
        }
      } = this.props;
      const { open } = this.state;
      if (userId !== '' && !open) {
        const dailyRewards = await getDailyRewards({ userId });
        this.setState({ dailyRewards, open: dailyRewards.givenPoints > 0 });
      }
    } finally {
      this.handleGetDailyRewards();
    }
  };

  handleClose = () => {
    this.setState({ open: false });
    this.handleGetDailyRewards();
  };

  render() {
    const {
      classes,
      user: {
        data: { userId, rank }
      }
    } = this.props;

    if (userId === '') return null;

    const {
      dailyRewards: { stage, pointsLeft },
      open
    } = this.state;

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          fullWidth
          maxWidth="xs"
          onClose={this.handleClose}
          aria-labelledby="daily-rewards-dialog-title"
          aria-describedby="daily-rewards-dialog-description"
        >
          <DialogTitle id="daily-rewards-dialog-title">
            Daily Rewards
          </DialogTitle>
          <div className={classes.root}>
            <List className={classes.list}>
              <ListItem className={cx(stage !== 0 && classes.opacity)}>
                <ListItemIcon className={classes.itemIcon}>
                  <img alt="Coin1" src={coin1} className={classes.coin} />
                </ListItemIcon>
                <ListItemText
                  primary="+100 Points"
                  secondary="Day 1"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
                {stage === 0 && (
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                )}
              </ListItem>
              <ListItem className={cx(stage !== 1 && classes.opacity)}>
                <ListItemIcon className={classes.itemIcon}>
                  <img alt="Coin2" src={coin2} className={classes.coin} />
                </ListItemIcon>
                <ListItemText
                  primary="+200 Points"
                  secondary="Day 2"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
                {stage === 1 && (
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                )}
              </ListItem>
              <ListItem className={cx(stage !== 2 && classes.opacity)}>
                <ListItemIcon className={classes.itemIcon}>
                  <img alt="Coin3" src={coin3} className={classes.coin} />
                </ListItemIcon>
                <ListItemText
                  primary="+300 Points"
                  secondary="Day 3"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
                {stage === 2 && (
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                )}
              </ListItem>
              <ListItem className={cx(stage !== 3 && classes.opacity)}>
                <ListItemIcon className={classes.itemIcon}>
                  <img alt="Coin4" src={coin4} className={classes.coin} />
                </ListItemIcon>
                <ListItemText
                  primary="+400 Points"
                  secondary="Day 4"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
                {stage === 3 && (
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                )}
              </ListItem>
              <ListItem className={cx(stage !== 4 && classes.opacity)}>
                <ListItemIcon className={classes.itemIcon}>
                  <img alt="Coin5" src={coin5} className={classes.coin} />
                </ListItemIcon>
                <ListItemText
                  primary="+500 Points"
                  secondary="Day 5"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
                {stage === 4 && (
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                )}
              </ListItem>
              <Divider light variant="middle" />
            </List>
          </div>
          <div className={classes.footer}>
            <Typography color="textPrimary" align="center" variant="h5">
              {`${pointsLeft.toLocaleString()} points until ${(
                ranks[rank] || {}
              ).label || ''}`}
            </Typography>
            <img
              className={classes.rank}
              alt={(ranks[rank] || {}).label || ''}
              src={(ranks[rank] || {}).value || ''}
            />
          </div>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              Great!
            </Button>
          </DialogActions>
        </Dialog>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withRoot(withSnackbar(withStyles(styles)(DailyRewards))));
