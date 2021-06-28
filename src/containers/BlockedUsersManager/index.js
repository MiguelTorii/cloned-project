// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { BlockedUsers } from '../../types/models';
import Dialog, { dialogStyle } from '../../components/Dialog';
import { getBlockedUsers, unblockUser } from '../../api/user';
import ErrorBoundary from '../ErrorBoundary';
import { getInitials } from 'utils/chat';

const styles = () => ({
  dialog: {
    dialogStyle,
    width: 400
  },
  list: {
    width: '100%',
    // minWidth: 360,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 200
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
  blockedUsers: BlockedUsers
};

class BlockedUsersManager extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    blockedUsers: []
  };

  componentDidUpdate = prevProps => {
    const { open } = this.props;
    if (open !== prevProps.open && open === true) {
      this.handleLoadBlockedUsers();
    }
  };

  handleLoadBlockedUsers = async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      const blockedUsers = await getBlockedUsers({ userId });
      this.setState({ blockedUsers, loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleUnBlock = blockedUserId => async () => {
    const {
      user: {
        data: { userId }
      }
    } = this.props;
    this.setState({ loading: true });
    try {
      await unblockUser({ userId, blockedUserId });
      await this.handleLoadBlockedUsers();
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
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
      open,
      onClose
    } = this.props;
    const { loading, blockedUsers } = this.state;
    if (!open) return null;
    if (isLoading) return <CircularProgress size={12} />;
    if (userId === '' || error)
      return 'Oops, there was an error loading your data, please try again.';

    return (
      <ErrorBoundary>
        <Dialog
          ariaDescribedBy="blocked-users-dialog-description"
          className={classes.dialog}
          onCancel={onClose}
          open={open}
          title="Blocked Users"
        >
          {loading && <CircularProgress size={12} />}
          {!loading && blockedUsers.length === 0 && (
            <Typography
              color="textPrimary"
              id="blocked-users-dialog-description"
            >
              You don't have blocked users
            </Typography>
          )}
          {!loading && (
            <List className={classes.list}>
              {blockedUsers.map(user => (
                <ListItem key={user.userId} dense>
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.profileImageUrl}>
                      {getInitials(user.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.handleUnBlock(user.userId)}
                    >
                      Unblock
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
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
)(withStyles(styles)(BlockedUsersManager));
