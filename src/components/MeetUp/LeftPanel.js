// @flow
import React, { Fragment } from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import ButtonBase from '@material-ui/core/ButtonBase';
import Drawer from '@material-ui/core/Drawer';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Divider from '@material-ui/core/Divider';
// import Badge from '@material-ui/core/Badge';
import GroupIcon from '@material-ui/icons/Group';
// import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

const styles = theme => ({
  root: {
    display: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 810,
    height: '100%'
  },
  paper: {
    position: 'relative',
    width: '100%',
    minWidth: 100,
    maxWidth: 100,
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    transition: 'margin-left 0.5s',
    display: 'flex',
    flexDirection: ' column'
  },
  paperHide: {
    marginLeft: -120
  },
  iconButton: {
    width: 100,
    height: 60
  },
  icon: {
    color: 'black'
  },
  drawer: {
    width: 400,
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
    overflowY: 'auto',
    height: '100%',
  },
  hide: {
    display: 'none'
  },
  margin: {
    margin: theme.spacing(2)
  },
  scroll: {
    maxHeight: '80vh',
    overflow: 'scroll',
  },
  iconActive: {
    color: theme.circleIn.palette.brand
  }
});

type Props = {
  classes: Object,
  // participants: number,
  thumbnails: Node,
  // localParticipant: Node,
  chat: Node,
  // unread: number,
  // dominantToggle: Function,
  // dominantView: boolean,
  onTabChange: Function
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
    const { onTabChange } = this.props;
    onTabChange(type);
  };

  handleClose = () => {
    this.setState({ type: '' });
    const { onTabChange } = this.props;
    onTabChange('');
  };

  handleChange = () => { };

  render() {
    const {
      classes,
      thumbnails,
      // dominantToggle,
      // localParticipant,
      chat,
      // dominantView,
      // unread
    } = this.props;
    const { type } = this.state;

    return (
      <Fragment>
        <div className={classes.root}>
          <Paper
            className={cx(classes.paper, (!thumbnails && classes.paperHide))}
            elevation={1}
          >
            {/* <div> */}
            {/* <ButtonBase */}
            {/* className={classes.iconButton} */}
            {/* onClick={dominantToggle} */}
            {/* > */}
            {/* <RecordVoiceOverIcon className={dominantView ? classes.iconActive : classes.icon} /> */}
            {/* </ButtonBase> */}
            {/* </div> */}
            {/* {localParticipant} */}
            <div className={classes.scroll}>
              {thumbnails}
            </div>
          </Paper>
        </div>
        <Drawer
          open={Boolean(type)}
          ModalProps={{
            BackdropProps: { invisible: true },
            keepMounted: true
          }}
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
            {/* <BottomNavigationAction */}
            {/* label="Classmates" */}
            {/* classes={{ label: classes.navButton }} */}
            {/* icon={<ChatBubbleIcon className={classes.icon} />} */}
            {/* onClick={this.handleOpen('chat')} */}
            {/* /> */}
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
          <div className={cx(classes.section, type !== 'chat' && classes.hide)}>
            {chat}
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LeftPanel);
