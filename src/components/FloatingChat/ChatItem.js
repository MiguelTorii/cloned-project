// @flow
import React, { Fragment } from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import VideoCamIcon from '@material-ui/icons/Videocam';
import SettingsIcon from '@material-ui/icons/Settings';
import RemoveIcon from '@material-ui/icons/Remove';
import ClearIcon from '@material-ui/icons/Clear';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DialogTitle from '../DialogTitle';

const styles = theme => ({
  paper: {
    marginRight: theme.spacing.unit * 2,
    width: 250,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomWidth: 0,
    backgroundColor: theme.circleIn.palette.appBar,
    borderColor: theme.circleIn.palette.borderColor,
    transition: 'width 0.25s, height 0.25s'
  },
  paperOpen: {
    height: 400,
    width: 300
  },
  paperExpanded: {
    height: 500,
    width: 500
  },
  header: {
    display: 'flex',
    minHeight: 40
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing.unit * 2,
    height: 40
  },
  title: {
    maxWidth: 120
  },
  titleExpanded: {
    maxWidth: 320
  },
  iconButton: {
    padding: theme.spacing.unit
  },
  content: {
    overflow: 'none',
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column'
  },
  hide: {
    display: 'none'
  },
  items: {
    height: 'inherit',
    paddingBottom: 60,
    overflowY: 'auto'
  },
  menu: {
    zIndex: 2100
  },
  dialog: {
    zIndex: 2100
  }
});

type Props = {
  classes: Object,
  children: Node,
  title: string,
  open: boolean,
  unread: number,
  expanded: boolean,
  // isGroup: boolean,
  onOpen: Function,
  onClose: Function,
  onDelete: Function,
  onStartVideoCall: Function,
  onViewMembers: Function,
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

  render() {
    const {
      classes,
      children,
      title,
      open,
      unread,
      expanded,
      // isGroup,
      onOpen,
      onClose,
      onStartVideoCall,
      onExpand
    } = this.props;
    const { anchorEl, openRemove } = this.state;
    return (
      <Fragment>
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
                  {expanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                </ButtonBase>
                <ButtonBase
                  className={classes.iconButton}
                  onClick={onStartVideoCall}
                >
                  <VideoCamIcon />
                </ButtonBase>
                <ButtonBase
                  className={classes.iconButton}
                  aria-owns={anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <SettingsIcon />
                </ButtonBase>
                <ButtonBase className={classes.iconButton} onClick={onOpen}>
                  <RemoveIcon />
                </ButtonBase>
              </Fragment>
            ) : (
              <ButtonBase className={classes.iconButton} onClick={onClose}>
                <ClearIcon />
              </ButtonBase>
            )}
          </div>
          <div className={cx(!open && classes.hide, classes.content)}>
            <Divider />
            {children}
          </div>
        </Paper>
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
          open={openRemove}
          onClose={this.handleRemoveClose}
          className={classes.dialog}
          aria-labelledby="remove-dialog-title"
          aria-describedby="remove-dialog-description"
        >
          <DialogTitle
            id="remove-dialog-title"
            onClose={this.handleRemoveClose}
          >
            Delete Chat
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              color="textPrimary"
              id="remove-dialog-description"
            >
              Are you sure you want to delete this chat?
              <br />
              <br />
              {"Deleting this chat can't be undone"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRemoveClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.handleRemoveSubmit} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ChatItem);
