import React, { Fragment } from "react";
import type { Node } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Badge from "@material-ui/core/Badge";
import SettingsIcon from "@material-ui/icons/Settings";
import RemoveIcon from "@material-ui/icons/Remove";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import { ReactComponent as VideoCameraIcon } from "assets/svg/float_chat_camera.svg";
import { ReactComponent as ExpandChatIcon } from "assets/svg/float_chat_collapse.svg";
import { ReactComponent as CollapseChatIcon } from "assets/svg/float_chat_expand.svg";
import Dialog from "../Dialog/Dialog";
import styles from "../_styles/FloatingChat/ChatItem";
type Props = {
  classes: Record<string, any>;
  channels: Array;
  local: Record<string, any>;
  children: Node;
  title: string;
  open: boolean;
  unread: number;
  expanded: boolean;
  videoEnabled: boolean;
  // isGroup: boolean,
  onOpen: (...args: Array<any>) => any;
  onClose: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
  onStartVideoCall: (...args: Array<any>) => any;
  onViewMembers: (...args: Array<any>) => any;
  newChannel: boolean;
  onExpand: (...args: Array<any>) => any;
  push: (...args: Array<any>) => any;
};
type State = {
  anchorEl: Record<string, any> | null | undefined;
  openRemove: boolean;
};

class ChatItem extends React.PureComponent<Props, State> {
  state = {
    anchorEl: null,
    openRemove: false
  };
  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };
  handleRemoveClick = () => {
    this.handleClose();
    this.setState({
      openRemove: true
    });
  };
  handleRemoveClose = () => {
    this.setState({
      openRemove: false
    });
  };
  handleRemoveSubmit = async () => {
    this.setState({
      openRemove: false
    });
    const {
      channels,
      channel,
      setCurrentChannel,
      onDelete,
      local
    } = this.props;
    const findAnotherDefaultChannel = channels.find(channelEntry => channelEntry !== channel.sid);

    if (findAnotherDefaultChannel) {
      await setCurrentChannel(local[findAnotherDefaultChannel].twilioChannel);
    } else {
      await setCurrentChannel(null);
    }

    onDelete();
  };
  handleViewMembers = () => {
    const {
      onViewMembers
    } = this.props;
    this.handleClose();
    onViewMembers();
  };
  handleExpandChat = () => {
    const {
      onExpand
    } = this.props;
    onExpand();
    this.handleClose();
  };
  handleGotoChat = async () => {
    const {
      channel,
      setCurrentChannel,
      push,
      setCurrentCommunityId
    } = this.props;
    setCurrentCommunityId('chat');
    await setCurrentChannel(channel);
    push('/chat');
  };

  // eslint-disable-next-line no-undef
  // el: HTMLDivElement
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
    const {
      anchorEl,
      openRemove
    } = this.state;
    return <>
        <div>
          <Paper className={cx(classes.paper, open && classes.paperOpen, open && expanded && classes.paperExpanded)} elevation={24}>
            <Badge color="secondary" badgeContent={unread}>
              <span />
            </Badge>
            <div className={cx(classes.header, unread && classes.notificationHeader)}>
              <ButtonBase className={classes.headerTitle} onClick={onOpen}>
                <Typography variant="h6" className={cx(classes.title, open && expanded && classes.titleExpanded)} noWrap>
                  {!newChannel ? title : 'New Chat'}
                </Typography>
              </ButtonBase>
              {open ? <>
                  <ButtonBase className={classes.iconButton} onClick={onExpand}>
                    {expanded ? <ExpandChatIcon className={classes.expandIcon} /> : <CollapseChatIcon className={classes.expandIcon} />}
                  </ButtonBase>
                  {!newChannel && videoEnabled && <ButtonBase className={classes.iconButton} onClick={onStartVideoCall}>
                      <VideoCameraIcon className={classes.icon} />
                    </ButtonBase>}
                  {!newChannel && <ButtonBase className={classes.iconButton} aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                      <SettingsIcon className={cx(classes.icon, classes.settingIcon)} />
                    </ButtonBase>}
                  {!newChannel ? <ButtonBase className={classes.iconButton} onClick={onOpen}>
                      <RemoveIcon className={classes.icon} />
                    </ButtonBase> : <ButtonBase className={classes.iconButton} onClick={onClose}>
                      <ClearIcon className={classes.icon} />
                    </ButtonBase>}
                </> : <ButtonBase className={classes.iconButton} onClick={onClose}>
                  <ClearIcon className={classes.icon} />
                </ButtonBase>}
            </div>
            <div className={cx(!open && classes.hide, classes.content, expanded && classes.contentExpanded)}>
              <Divider />
              {children}
            </div>
          </Paper>
        </div>
        <Menu id="simple-menu" className={classes.menu} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleGotoChat}>Go to Chat</MenuItem>
          <MenuItem onClick={this.handleExpandChat}>
            {expanded ? 'Collapse Chat' : 'Expand Chat'}
          </MenuItem>
          <MenuItem onClick={this.handleViewMembers}>Members</MenuItem>
          {false && <MenuItem onClick={this.handleClose}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Edit
            </MenuItem>}
          <MenuItem className={classes.delete} onClick={this.handleRemoveClick}>
            Delete
          </MenuItem>
        </Menu>
        <Dialog ariaDescribedBy="remove-dialog-description" className={classes.dialog} okTitle="Delete" onCancel={this.handleRemoveClose} onOk={this.handleRemoveSubmit} open={openRemove} showActions showCancel title="Delete Chat">
          <Typography color="textPrimary" id="remove-dialog-description">
            Are you sure you want to delete this chat?
            <br />
            <br />
            {"Deleting this chat can't be undone"}
          </Typography>
        </Dialog>
      </>;
  }

}

export default withStyles(styles)(ChatItem);