// @flow
import React from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import RemoveIcon from '@material-ui/icons/Remove';

const styles = theme => ({
  paper: {
    marginRight: theme.spacing(2),
    width: 250,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.circleIn.palette.appBar,
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
    background: theme.circleIn.palette.brand,
    display: 'flex',
    minHeight: 40
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    height: 40
  },
  iconButton: {
    padding: theme.spacing()
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
  margin: {
    marginLeft: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  children: Node,
  unread: number,
  onCreateChannel: Function
};

type State = {
  open: boolean
};

class MainChat extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  handleOpen = () => this.setState(prevState => ({ open: !prevState.open }));

  handleCreateChannel = type => () => {
    const { onCreateChannel } = this.props;
    onCreateChannel(type);
  };

  render() {
    const { classes, children, unread } = this.props;
    const { open } = this.state;

    return (
      <Paper
        className={cx(classes.paper, open && classes.paperOpen)}
        elevation={24}
      >
        <div className={classes.header}>
          <ButtonBase className={classes.headerTitle} onClick={this.handleOpen}>
            <Typography variant="h6">Chats</Typography>
            <Badge
              className={classes.margin}
              badgeContent={unread}
              color="secondary"
            >
              <span />
            </Badge>
          </ButtonBase>
          <ButtonBase
            className={classes.iconButton}
            onClick={this.handleCreateChannel('single')}
          >
            <PersonAddIcon />
          </ButtonBase>
          <ButtonBase
            className={classes.iconButton}
            onClick={this.handleCreateChannel('group')}
          >
            <GroupAddIcon />
          </ButtonBase>
          {open && (
            <ButtonBase
              className={classes.iconButton}
              onClick={this.handleOpen}
            >
              <RemoveIcon />
            </ButtonBase>
          )}
        </div>
        <div className={cx(!open && classes.hide, classes.content)}>
          <Divider />
          <div className={classes.items}>{children}</div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(MainChat);
