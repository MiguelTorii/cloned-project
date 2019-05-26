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
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Leaderboard as LeaderboardType } from '../../types/models';
import { getLeaderboard } from '../../api/user';
import { logEvent } from '../../api/analytics';
import ErrorBoundary from '../ErrorBoundary';

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
    margin: theme.spacing.unit
  },
  list: {
    width: '100%',
    position: 'relative',
    overflow: 'auto'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
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
          <DialogTitle id="leaderboard-dialog-title">Leaderboard</DialogTitle>
          <DialogContent style={{ width: 490, height: 400 }}>
            {loading && <CircularProgress size={12} />}
            {!loading && (
              <Fragment>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.formControl}
                >
                  <Select
                    value={rankId}
                    onChange={this.handleChange}
                    input={
                      <OutlinedInput
                        labelWidth={0}
                        name="rank"
                        id="outlined-rank-simple"
                      />
                    }
                  >
                    <MenuItem value={1}>Bronze</MenuItem>
                    <MenuItem value={2}>Silver</MenuItem>
                    <MenuItem value={3}>Gold</MenuItem>
                    <MenuItem value={4}>Platinum</MenuItem>
                    <MenuItem value={5}>Diamond</MenuItem>
                    <MenuItem value={6}>Master</MenuItem>
                  </Select>
                </FormControl>
                <List className={classes.list}>
                  {leaderboard.map((user, index) => (
                    <ListItem
                      key={user.userId}
                      selected={user.userId === userId}
                      style={{ display: 'flex' }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          className={cx(
                            user.userId === userId && classes.avatar
                          )}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          variant: 'subtitle1'
                        }}
                        primary={user.userId === userId ? 'You' : user.username}
                        style={{
                          flex: 1,
                          minWidth: 300
                        }}
                      />
                      <ListItemText
                        primaryTypographyProps={{
                          variant: 'subtitle1'
                        }}
                        primary={user.points}
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
