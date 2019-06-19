// @flow

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import ViewListIcon from '@material-ui/icons/ViewList';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChatIcon from '@material-ui/icons/Chat';

const MyLink = ({ href, ...props }) => <RouterLink to={href} {...props} />;

const styles = () => ({
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0
  }
});

type Props = {
  classes: Object
};

type State = {
  value: number
};

class BottomNav extends React.PureComponent<Props, State> {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.bottomNav}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={MyLink}
          href="/"
        />
        <BottomNavigationAction
          label="Feed"
          icon={<ViewListIcon />}
          component={MyLink}
          href="/feed"
        />
        <BottomNavigationAction label="New" icon={<AddCircleOutlineIcon />} />
        <BottomNavigationAction label="Messages" icon={<ChatIcon />} />
        <BottomNavigationAction
          label="Notifications"
          icon={<NotificationsIcon />}
        />
      </BottomNavigation>
    );
  }
}

export default withStyles(styles)(BottomNav);
