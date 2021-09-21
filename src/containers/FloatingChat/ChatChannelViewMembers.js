// @flow

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import RoleBadge from 'components/RoleBadge/RoleBadge';
import Dialog, { dialogStyle } from 'components/Dialog/Dialog';
import { getInitials } from 'utils/chat';
import type { ChatUser } from '../../types/models';
import { blockUser } from '../../api/user';
import { getGroupMembers } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  list: {
    width: '100%'
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  dialog: {
    ...dialogStyle,
    width: 500,
    zIndex: 2100
  }
});

type Props = {
  classes: Object,
  open: boolean,
  userId: string,
  chatId: string,
  onClose: Function,
  onBlock: Function,
  onAddMember: Function
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

  componentDidUpdate = async (prevProps) => {
    const { chatId, open } = this.props;
    if (open && !prevProps.open) {
      const members = await getGroupMembers({ chatId });
      this.setState({ members });
    }
  };

  handleOpenConfirm =
    ({ blockedUserId, name }) =>
    () => {
      this.setState({ blockedUserId, name });
    };

  handleConfirmClose = () => {
    this.setState({ blockedUserId: null, name: null });
  };

  handleBlock = (blockedUserId) => async () => {
    const { userId, onBlock, onClose } = this.props;

    this.setState({ loading: true });
    try {
      await blockUser({ userId, blockedUserId: String(blockedUserId) });
      await onBlock({ blockedUserId });
    } catch (err) {
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
      onClose();
    }
    this.handleConfirmClose();
  };

  render() {
    const { classes, open, userId, onClose, onAddMember } = this.props;
    const { loading, blockedUserId, name, members } = this.state;
    return (
      <Fragment>
        <ErrorBoundary>
          <Dialog
            className={classes.dialog}
            disableActions={loading}
            disableEscapeKeyDown={loading}
            okTitle="Add Member"
            onCancel={onClose}
            onOk={onAddMember}
            open={open}
            showActions
            showCancel
            title="Members"
          >
            <List className={classes.list}>
              {members.map((member) => (
                  <ListItem key={member.userId} role={undefined} dense>
                    <ListItemAvatar>
                      <OnlineBadge
                        isOnline={member.isOnline}
                        bgColorPath="circleIn.palette.feedBackground"
                      >
                        <Avatar
                          alt={`${member.firstName} ${member.lastName}`}
                          src={member.profileImageUrl}
                        >
                          {getInitials(
                            `${member.firstName} ${member.lastName}`
                          )}
                        </Avatar>
                      </OnlineBadge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        Number(userId) === Number(member.userId) ? (
                          <Box display="flex">
                            me &nbsp; {member.role && <RoleBadge />}
                          </Box>
                        ) : (
                          <Box display="flex">
                            {`${member.firstName} ${member.lastName}`} &nbsp;{' '}
                            {member.roleId !== 1 && <RoleBadge />}
                          </Box>
                        )
                      }
                    />
                    {Number(userId) !== Number(member.userId) && (
                      <ListItemSecondaryAction>
                        <div className={classes.wrapper}>
                          <Button
                            onClick={this.handleOpenConfirm({
                              blockedUserId: member.userId,
                              name: `${member.firstName} ${member.lastName}`
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
          </Dialog>
        </ErrorBoundary>
        <ErrorBoundary>
          <Dialog
            ariaDescribedBy="confirm-dialog-description"
            className={classes.dialog}
            okTitle="Yes, I'm sure"
            onCancel={this.handleConfirmClose}
            onOk={this.handleBlock(blockedUserId)}
            open={Boolean(blockedUserId)}
            showActions
            showCancel
            title="Block User"
          >
            <Typography color="textPrimary" id="confirm-dialog-description">
              Are you sure you want to block {name}
            </Typography>
          </Dialog>
        </ErrorBoundary>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ChatChannelViewMembers);
