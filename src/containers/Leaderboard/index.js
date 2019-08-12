// @flow

import React, { Fragment } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '../../components/DialogTitle';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Leaderboard as LeaderboardType } from '../../types/models';
import { getLeaderboard } from '../../api/user';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';

const ranks = {
  '1': 'Bronze',
  '2': 'Silver',
  '3': 'Gold',
  '4': 'Platinum',
  '5': 'Diamond',
  '6': 'Master'
};

const styles = theme => ({
  root: {},
  formControl: {
    margin: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  list: {
    width: '100%',
    position: 'relative',
    overflow: 'auto'
  },
  avatar: {
    width: 30,
    height: 30
  },
  avatarSelected: {
    backgroundColor: theme.palette.primary.main
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  select: {
    width: 120,
    borderBottom: '1px solid rgba(255, 255, 255, 0.42)'
  },
  input: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing.unit * 2
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2
  },
  selected: {
    backgroundColor: theme.circleIn.palette.action
  },
  top: {
    backgroundColor: '#29414e'
  }
});

type Props = {
  classes: Object,
  user: UserState,
  open: boolean,
  onClose: Function
};

type State = {
  loading: boolean,
  leaderboard: LeaderboardType,
  rankId: number
};

class Leaderboard extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    leaderboard: [],
    rankId: 1
  };

  componentDidUpdate = async prevProps => {
    const {
      open,
      user: {
        data: { rank }
      }
    } = this.props;
    if (open !== prevProps.open && open === true) {
      if (rank !== 0) {
        await this.setState({ rankId: rank });
        this.handleGetLeaderboard();
      }
      logEvent({
        event: 'Leaderboard- Opened',
        props: {}
      });
    }
  };

  handleGetLeaderboard = async () => {
    const {
      user: {
        data: { userId, schoolId }
      }
    } = this.props;
    const { rankId } = this.state;
    this.setState({ loading: true });
    try {
      const leaderboard = await getLeaderboard({
        userId,
        schoolId,
        rankId,
        index: 0,
        limit: 50
      });
      this.setState({ leaderboard, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleChange = async event => {
    await this.setState({ rankId: event.target.value });
    this.handleGetLeaderboard();
  };

  handleClose = () => {
    const { onClose } = this.props;
    try {
      logEvent({
        event: 'Leaderboard- Closed',
        props: {}
      });
    } finally {
      onClose();
    }
  };

  render() {
    const {
      classes,
      user: {
        isLoading,
        error,
        data: { userId }
      },
      open
    } = this.props;
    const { loading, leaderboard, rankId } = this.state;
    if (!open) return null;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <Dialog
          open={open}
          className={classes.root}
          onClose={this.handleClose}
          aria-labelledby="leaderboard-dialog-title"
          aria-describedby="leaderboard-dialog-description"
        >
          <DialogTitle id="leaderboard-dialog-title" onClose={this.handleClose}>
            Leaderboard
          </DialogTitle>
          <DialogContent style={{ width: 490, height: 400 }}>
            {loading && <CircularProgress size={12} />}
            {!loading && (
              <Fragment>
                <FormControl variant="outlined" className={classes.formControl}>
                  <Select
                    value={rankId}
                    onChange={this.handleChange}
                    className={classes.select}
                    SelectDisplayProps={{ className: classes.input }}
                  >
                    <MenuItem value={1} className={classes.item}>
                      Bronze
                      <img alt="Bronze" src={bronze} className={classes.icon} />
                    </MenuItem>
                    <MenuItem value={2}>
                      Silver
                      <img alt="Silver" src={silver} className={classes.icon} />
                    </MenuItem>
                    <MenuItem value={3}>
                      Gold
                      <img alt="Gold" src={gold} className={classes.icon} />
                    </MenuItem>
                    <MenuItem value={4}>
                      Platinum
                      <img
                        alt="Platinum"
                        src={platinum}
                        className={classes.icon}
                      />
                    </MenuItem>
                    <MenuItem value={5}>
                      Diamond
                      <img
                        alt="Diamond"
                        src={diamond}
                        className={classes.icon}
                      />
                    </MenuItem>
                    <MenuItem value={6}>
                      Master
                      <img alt="Master" src={master} className={classes.icon} />
                    </MenuItem>
                  </Select>
                </FormControl>
                <List className={classes.list}>
                  {leaderboard.map((user, index) => (
                    <ListItem
                      key={user.userId}
                      style={{ display: 'flex' }}
                      className={cx(
                        index < 10 && user.userId !== userId && classes.top,
                        user.userId === userId && classes.selected
                      )}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          variant: 'h6',
                          color: 'textPrimary',
                          style: {
                            color: user.userId === userId && 'black',
                            fontWeight: 'bold'
                          }
                        }}
                        primary={index + 1}
                      />
                      <ListItemText
                        primaryTypographyProps={{
                          variant: 'h6',
                          style: {
                            color: user.userId === userId && 'black',
                            fontWeight: 'bold'
                          }
                        }}
                        primary={user.userId === userId ? 'You' : user.username}
                        style={{
                          flex: 1,
                          minWidth: 300,
                          fontWeight: 'bold'
                        }}
                      />
                      <ListItemText
                        primaryTypographyProps={{
                          variant: 'h6',
                          style: {
                            color: user.userId === userId && 'black',
                            fontWeight: 'bold'
                          }
                        }}
                        primary={user.points.toLocaleString()}
                        style={{
                          fontWeight: 'bold'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                {leaderboard.length === 0 && (
                  <div className={classes.empty}>
                    <Typography
                      variant="h5"
                      align="center"
                    >{`There aren't any students with a ${
                      ranks[rankId]
                    } ranking yet.`}</Typography>
                  </div>
                )}
              </Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              variant="contained"
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
)(withStyles(styles)(Leaderboard));
