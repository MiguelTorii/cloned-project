// @flow
import React, { Fragment } from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import VideoCamIcon from '@material-ui/icons/Videocam';
import SettingsIcon from '@material-ui/icons/Settings';
import RemoveIcon from '@material-ui/icons/Remove';
import ClearIcon from '@material-ui/icons/Clear';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '../Dialog';

import { styles } from '../_styles/FloatingChat/ChatItem';

type Props = {
  classes: Object,
  children: Node,
  title: string,
  open: boolean,
  unread: number,
  expanded: boolean,
  videoEnabled: boolean,
  // isGroup: boolean,
  onOpen: Function,
  onClose: Function,
  onDelete: Function,
  onStartVideoCall: Function,
  onViewMembers: Function,
  newChannel: boolean,
  onExpand: Function
};

type State = {
  anchorEl: ?Object,
  openRemove: boolean
};

class ChatItem extends React.PureComponent<Props, State> {
  state = {
    anchorEl: null,
    openRemove: false
  };


  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleRemoveClick = () => {
    this.handleClose();
    this.setState({ openRemove: true });
  };

  handleRemoveClose = () => {
    this.setState({ openRemove: false });
  };

  handleRemoveSubmit = () => {
    this.setState({ openRemove: false });
    const { onDelete } = this.props;
    onDelete();
  };

  handleViewMembers = () => {
    const { onViewMembers } = this.props;
    this.handleClose();
    onViewMembers();
  };

  // eslint-disable-next-line no-undef
  // el: HTMLDivElement;

  render() {
    const {
      classes,
      children,
      title,
      open,
      unread,
      expanded,
      videoEnabled,
      newChannel,
      onOpen,
      onClose,
      onStartVideoCall,
      onExpand
    } = this.props;
    const { anchorEl, openRemove } = this.state;
    return (
      <Fragment>
        <div
        // ref={node => {
        //   this.el = node;
        // }}
        >
          <Paper
            className={cx(
              classes.paper,
              open && classes.paperOpen,
              open && expanded && classes.paperExpanded
            )}
            elevation={24}
          >
            <Badge color="secondary" badgeContent={unread}>
              <span />
            </Badge>
            <div className={classes.header}>
              <ButtonBase className={classes.headerTitle} onClick={onOpen}>
                <Typography
                  variant="h6"
                  className={cx(
                    classes.title,
                    open && expanded && classes.titleExpanded
                  )}
                  noWrap
                >
                  {title}
                </Typography>
              </ButtonBase>
              {open ? (
                <Fragment>
                  <ButtonBase className={classes.iconButton} onClick={onExpand}>
                    {expanded ? (
                      <UnfoldLessIcon className={classes.expandIcon}  />
                    ) : (
                      <UnfoldMoreIcon className={classes.expandIcon} />
                    )}
                  </ButtonBase>
                  {!newChannel && videoEnabled && <ButtonBase
                    className={classes.iconButton}
                    onClick={onStartVideoCall}
                  >
                    <VideoCamIcon className={classes.icon} />
                  </ButtonBase>}
                  {!newChannel && <ButtonBase
                    className={classes.iconButton}
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                  >
                    <SettingsIcon className={classes.icon} />
                  </ButtonBase>}
                  <ButtonBase className={classes.iconButton} onClick={onOpen}>
                    <RemoveIcon className={classes.icon} />
                  </ButtonBase>
                </Fragment>
              ) : (
                <ButtonBase className={classes.iconButton} onClick={onClose}>
                  <ClearIcon className={classes.icon} />
                </ButtonBase>
              )}
            </div>
            <div
              className={cx(
                !open && classes.hide,
                classes.content,
                expanded && classes.contentExpanded
              )}
            >
              <Divider />
              {children}
            </div>
          </Paper>
        </div>
        <Menu
          id="simple-menu"
          className={classes.menu}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleViewMembers}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            Members
          </MenuItem>
          {false && (
            <MenuItem onClick={this.handleClose}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
          )}
          <MenuItem onClick={this.handleRemoveClick}>
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            Remove
          </MenuItem>
        </Menu>
        <Dialog
          ariaDescribedBy="remove-dialog-description"
          className={classes.dialog}
          okTitle="Delete"
          onCancel={this.handleRemoveClose}
          onOk={this.handleRemoveSubmit}
          open={openRemove}
          showActions
          showCancel
          title="Delete Chat"
        >
          <Typography
            color="textPrimary"
            id="remove-dialog-description"
          >
            Are you sure you want to delete this chat?
            <br />
            <br />
            Deleting this chat can't be undone
          </Typography>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ChatItem);
