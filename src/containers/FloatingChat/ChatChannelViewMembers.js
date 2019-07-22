// @flow

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '../../components/DialogTitle';
import { getInitials } from './utils';
import type { ChatUser } from '../../types/models';
import { blockUser } from '../../api/user';
import { getGroupMembers } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary';

const styles = theme => ({
  dialog: {
    zIndex: 2100
  },
  list: {
    width: '100%'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

type Props = {
  classes: Object,
  open: boolean,
  userId: string,
  chatId: string,
  onClose: Function,
  onBlock: Function
};

type State = {
  loading: boolean,
  blockedUserId: ?string,
  name: ?string,
  members: Array<ChatUser>
};

class ChatChannelViewMembers extends React.PureComponent<Props, State> {
  state = {
    loading: false,
    blockedUserId: null,
    name: null,
    members: []
  };

  componentDidUpdate = async prevProps => {
    const { chatId, open } = this.props;
    if (open && !prevProps.open) {
      const members = await getGroupMembers({ chatId });
      this.setState({ members });
    }
  };

  handleOpenConfirm = ({ blockedUserId, name }) => () => {
    this.setState({ blockedUserId, name });
  };

  handleConfirmClose = () => {
    this.setState({ blockedUserId: null, name: null });
  };

  handleBlock = blockedUserId => async () => {
    const { userId, onBlock, onClose } = this.props;
    this.handleConfirmClose();
    this.setState({ loading: true });
    try {
      await blockUser({ userId, blockedUserId: String(blockedUserId) });
      await onBlock(blockedUserId);
    } catch (err) {
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
      onClose();
    }
  };

  render() {
    const { classes, open, userId, onClose } = this.props;
    const { loading, blockedUserId, name, members } = this.state;

    return (
      <Fragment>
        <ErrorBoundary>
          <Dialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown={loading}
            disableBackdropClick={loading}
            maxWidth="xs"
            fullWidth
            className={classes.dialog}
            aria-labelledby="members-dialog-title"
          >
            <DialogTitle id="members-dialog-title" onClose={onClose}>
              Members
            </DialogTitle>
            <DialogContent>
              <List className={classes.list}>
                {members.map(value => (
                  <ListItem key={value.userId} role={undefined} dense>
                    <ListItemAvatar>
                      <Avatar
                        alt={`${value.firstName} ${value.lastName}`}
                        src={value.profileImageUrl}
                      >
                        {getInitials({
                          name: `${value.firstName} ${value.lastName}`
                        })}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        Number(userId) === Number(value.userId)
                          ? 'me'
                          : `${value.firstName} ${value.lastName}`
                      }
                    />
                    {Number(userId) !== Number(value.userId) && (
                      <ListItemSecondaryAction>
                        <div className={classes.wrapper}>
                          <Button
                            onClick={this.handleOpenConfirm({
                              blockedUserId: value.userId,
                              name: `${value.firstName} ${value.lastName}`
                            })}
                            disabled={loading}
                            color="secondary"
                            aria-label="Block"
                            variant="contained"
                          >
                            Block
                          </Button>
                          {loading && (
                            <CircularProgress
                              size={24}
                              className={classes.buttonProgress}
                            />
                          )}
                        </div>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                disabled={loading}
                color="primary"
                variant="contained"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </ErrorBoundary>
        <ErrorBoundary>
          <Dialog
            open={Boolean(blockedUserId)}
            onClose={this.handleConfirmClose}
            className={classes.dialog}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <DialogTitle
              id="confirm-dialog-title"
              onClose={this.handleConfirmClose}
            >
              Block User
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                color="textPrimary"
                id="confirm-dialog-description"
              >
                Are you sure you want to block {name}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleConfirmClose}
                color="primary"
                autoFocus
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleBlock(blockedUserId)}
                color="secondary"
              >
                {"Yes, I'm sure"}
              </Button>
            </DialogActions>
          </Dialog>
        </ErrorBoundary>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ChatChannelViewMembers);
