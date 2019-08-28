// @flow

import React from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '../../components/DialogTitle';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { DailyStreaksCard } from '../../types/models';
import { getDailyStreaks, getDailyRewards } from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';
// $FlowIgnore
import { ReactComponent as StreakIcon } from '../../assets/svg/ic_streak.svg';

const size = 150;
const thickness = 10;

const styles = theme => ({
  progressWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 170
  },
  progress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    color: theme.circleIn.palette.success
  },
  completed: {
    color: '#efc448'
  },
  background: {
    color: theme.circleIn.palette.disabled
  },
  circle: {
    filter: 'drop-shadow(-3px 2px 4px rgba(0, 0, 0, .5))'
  },
  dayText: {
    color: '#fec04f',
    fontWeight: 'bold'
  },
  dayTextCompleted: {
    color: '#e9ecef'
  },
  tiers: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: theme.spacing.unit
  },
  tierItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80
  },
  tierShapes: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: theme.spacing.unit
  },
  tierCircle: {
    background: '#60b515',
    width: 25,
    height: 25,
    borderRadius: '50%',
    zIndex: 2
  },
  tierLine: {
    background: '#60b515',
    width: 40,
    height: 6,
    zIndex: 1,
    position: 'absolute',
    right: -20,
    top: 'calc(50%-3px)'
  },
  left: {
    left: -20
  },
  disabled: {
    background: '#6d7884',
    zIndex: 1
  },
  hidden: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  dailyStreaks: DailyStreaksCard,
  open: boolean
};

class DailyRewards extends React.PureComponent<Props, State> {
  state = {
    dailyStreaks: {
      title: '',
      currentDay: 0,
      hasSeen: false,
      subtitle: {
        text: '',
        style: []
      },
      tiers: []
    },
    open: false
  };

  componentDidMount = () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;

    window.addEventListener('offline', () => {
      if (
        this.handleGetDailyRewards.cancel &&
        typeof this.handleGetDailyRewards.cancel === 'function'
      )
        this.handleGetDailyRewards.cancel();
    });
    window.addEventListener('online', () => {
      if (userId !== '') this.handleGetDailyRewards();
    });

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

  componentWillUnmount = () => {
    if (
      this.handleGetDailyRewards.cancel &&
      typeof this.handleGetDailyRewards.cancel === 'function'
    )
      this.handleGetDailyRewards.cancel();
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
        const dailyStreaks = await getDailyStreaks();
        const dailyRewards = await getDailyRewards({ userId });
        this.setState({
          dailyStreaks,
          open: dailyRewards.givenPoints > 0
        });
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
        data: { userId }
      }
    } = this.props;

    if (userId === '') return null;

    const {
      dailyStreaks: { currentDay, tiers },
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
          <DialogTitle
            id="daily-rewards-dialog-title"
            onClose={this.handleClose}
          >
            {currentDay !== 5 ? 'You’re heating up!' : 'You’re AMAZING!'}{' '}
            <StreakIcon />
          </DialogTitle>
          <DialogContent>
            <div className={classes.progressWrapper}>
              <div className={classes.progress}>
                <CircularProgress
                  className={classes.background}
                  variant="static"
                  value={100}
                  size={size}
                  thickness={thickness}
                  classes={{ svg: classes.circle }}
                />
              </div>
              <div className={classes.progress}>
                <CircularProgress
                  className={cx(
                    classes.main,
                    currentDay === 5 && classes.completed
                  )}
                  variant="static"
                  value={(currentDay * 100) / 5}
                  size={size}
                  thickness={thickness}
                />
              </div>
              <div className={classes.progress}>
                <Typography
                  variant="h6"
                  className={cx(
                    classes.dayText,
                    currentDay === 5 && classes.dayTextCompleted
                  )}
                  align="center"
                >
                  {`Day ${currentDay}`}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  {`+${(tiers.find(o => o.day === currentDay) || {}).points ||
                    0}`}
                </Typography>
              </div>
            </div>
            <div className={classes.tiers}>
              {tiers.map(tier => (
                <div key={tier.day} className={classes.tierItem}>
                  <div className={classes.tierShapes}>
                    <div
                      className={cx(
                        classes.tierCircle,
                        tier.day > currentDay && classes.disabled
                      )}
                    />
                    <div
                      className={cx(
                        classes.tierLine,
                        tier.day >= currentDay && classes.disabled,
                        tier.day === 5 && classes.hidden
                      )}
                    />
                    <div
                      className={cx(
                        classes.tierLine,
                        classes.left,
                        tier.day > currentDay && classes.disabled,
                        tier.day === 1 && classes.hidden
                      )}
                    />
                  </div>
                  <Typography>{`+${tier.points.toLocaleString()}`}</Typography>
                </div>
              ))}
              {/* <div className={classes.tierItem}>
                <div className={classes.tierShapes}>
                  <div className={classes.tierCircle} />
                  <div className={classes.tierLine} />
                  <div
                    className={cx(
                      classes.tierLine,
                      classes.left,
                      classes.hidden
                    )}
                  />
                </div>
                <Typography>+10000</Typography>
              </div>
              <div className={classes.tierItem}>
                <div className={classes.tierShapes}>
                  <div className={classes.tierCircle} />
                  <div className={classes.tierLine} />
                  <div className={cx(classes.tierLine, classes.left)} />
                </div>
                <Typography>+20000</Typography>
              </div>
              <div className={classes.tierItem}>
                <div className={classes.tierShapes}>
                  <div className={classes.tierCircle} />
                  <div className={classes.tierLine} />
                  <div className={cx(classes.tierLine, classes.left)} />
                </div>
                <Typography>+30000</Typography>
              </div>
              <div className={classes.tierItem}>
                <div className={classes.tierShapes}>
                  <div className={classes.tierCircle} />
                  <div className={cx(classes.tierLine, classes.disabled)} />
                  <div className={cx(classes.tierLine, classes.left)} />
                </div>
                <Typography>+40000</Typography>
              </div>
              <div className={classes.tierItem}>
                <div className={classes.tierShapes}>
                  <div className={cx(classes.tierCircle, classes.disabled)} />
                  <div className={cx(classes.tierLine, classes.hidden)} />
                  <div
                    className={cx(
                      classes.tierLine,
                      classes.left,
                      classes.disabled
                    )}
                  />
                </div>
                <Typography>+50000</Typography>
              </div> */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              variant="contained"
              color="primary"
              autoFocus
            >
              Got It!
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
