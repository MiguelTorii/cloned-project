// @flow
import React, { Fragment } from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Drawer from '@material-ui/core/Drawer';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import GroupIcon from '@material-ui/icons/Group';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 810
  },
  paper: {
    position: 'relative',
    width: '100%',
    minWidth: 120,
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    transition: 'margin-left 0.5s'
  },
  paperHide: {
    marginLeft: -120
  },
  iconButton: {
    width: 60,
    height: 60
  },
  icon: {
    color: 'black'
  },
  drawer: {
    width: 200,
    backgroundColor: 'white',
    overflowY: 'hidden'
  },
  nav: {
    backgroundColor: 'white'
  },
  navButton: {
    color: 'black'
  },
  section: {
    // position: 'fixed',
    overflowY: 'auto'
    // height: '100%'
  },
  hide: {
    display: 'none'
  },
  margin: {
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  participants: number,
  thumbnails: Node
};

type State = {
  type: string
};

class LeftPanel extends React.PureComponent<Props, State> {
  state = {
    type: ''
  };

  handleOpen = type => () => {
    this.setState({ type });
  };

  handleClose = () => {
    this.setState({ type: '' });
  };

  handleChange = () => {};

  render() {
    const { classes, participants, thumbnails } = this.props;
    const { type } = this.state;

    return (
      <Fragment>
        <div className={classes.root}>
          <Paper
            className={cx(classes.paper, Boolean(type) && classes.paperHide)}
            elevation={1}
          >
            <ButtonBase
              className={classes.iconButton}
              onClick={this.handleOpen('participants')}
            >
              <Badge
                className={classes.margin}
                badgeContent={participants}
                color="primary"
              >
                <GroupIcon className={classes.icon} />
              </Badge>
            </ButtonBase>
            <ButtonBase
              className={classes.iconButton}
              onClick={this.handleOpen('chat')}
            >
              <ChatBubbleIcon className={classes.icon} />
            </ButtonBase>
          </Paper>
        </div>
        <Drawer
          open={Boolean(type)}
          ModalProps={{ BackdropProps: { invisible: true }, keepMounted: true }}
          classes={{ paper: classes.drawer }}
          onClose={this.handleClose}
        >
          <BottomNavigation
            value={0}
            onChange={this.handleChange}
            showLabels
            className={classes.nav}
          >
            <BottomNavigationAction
              label="Classmates"
              classes={{ label: classes.navButton }}
              icon={<GroupIcon className={classes.icon} />}
              onClick={this.handleOpen('participants')}
            />
            <BottomNavigationAction
              label="Chat"
              classes={{ label: classes.navButton }}
              icon={<ChatBubbleIcon className={classes.icon} />}
              onClick={this.handleOpen('chat')}
            />
          </BottomNavigation>
          <Divider />
          <div
            className={cx(
              classes.section,
              type !== 'participants' && classes.hide
            )}
          >
            {thumbnails}
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LeftPanel);
