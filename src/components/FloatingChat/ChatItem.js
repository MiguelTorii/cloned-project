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
import VideoCamIcon from '@material-ui/icons/Videocam';
import SettingsIcon from '@material-ui/icons/Settings';
import RemoveIcon from '@material-ui/icons/Remove';
import ClearIcon from '@material-ui/icons/Clear';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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
    borderColor: theme.circleIn.palette.borderColor,
    transition: 'width 0.25s, height 0.25s'
  },
  paperOpen: {
    height: 400,
    width: 300
  },
  header: {
    display: 'flex'
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing.unit * 2,
    height: 40
  },
  title: {
    maxWidth: 140
  },
  iconButton: {
    padding: theme.spacing.unit
  },
  content: {
    overflow: 'none',
    height: 'inherit'
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
  badge: {
    // marginRight: -100
  }
});

type Props = {
  classes: Object,
  children: Node,
  title: string,
  open: boolean,
  unread: number,
  onOpen: Function,
  onClose: Function
};

type State = {
  anchorEl: ?Object
};

class ChatItem extends React.PureComponent<Props, State> {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      classes,
      children,
      title,
      open,
      unread,
      onOpen,
      onClose
    } = this.props;
    const { anchorEl } = this.state;
    return (
      <Fragment>
        <Paper
          className={cx(classes.paper, open && classes.paperOpen)}
          elevation={24}
        >
          <Badge
            color="secondary"
            badgeContent={unread}
            className={classes.badge}
          >
            <span />
          </Badge>
          <div className={classes.header}>
            <ButtonBase className={classes.headerTitle} onClick={onOpen}>
              <Typography variant="h6" className={classes.title} noWrap>
                {title}
              </Typography>
            </ButtonBase>
            {open ? (
              <Fragment>
                <ButtonBase className={classes.iconButton}>
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
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            Members
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            Remove
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ChatItem);
