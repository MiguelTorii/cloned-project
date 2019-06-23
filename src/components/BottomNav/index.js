// @flow

import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
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
  value: number,
  open: boolean
};

class BottomNav extends React.PureComponent<Props, State> {
  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { classes } = this.props;
    const { value, open } = this.state;

    return (
      <Fragment>
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
          <BottomNavigationAction
            label="New"
            icon={<AddCircleOutlineIcon />}
            onClick={this.handleOpen}
          />
          <BottomNavigationAction
            label="Messages"
            icon={<ChatIcon />}
            component={MyLink}
            href="/chat"
          />
          <BottomNavigationAction
            label="Notifications"
            icon={<NotificationsIcon />}
          />
        </BottomNavigation>
        <Dialog open={open} fullWidth onClose={this.handleClose}>
          <div>
            <List>
              <ListItem button component={MyLink} href="/create/question">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ask a Question"
                  secondary="1,000 points for best answer"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
              </ListItem>
              <ListItem button component={MyLink} href="/create/notes">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Share Notes"
                  secondary="500 points for initial page, 100 for each additional page"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
              </ListItem>
              <ListItem button component={MyLink} href="/create/flashcards">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create Flashcards"
                  secondary="500 points"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
              </ListItem>
              <ListItem button component={MyLink} href="/create/sharelink">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Share a Link"
                  secondary="200 - 500 points"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Make an Announcement" />
              </ListItem>
              <ListItem button component={MyLink} href="/video-call">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create a Video Study Session"
                  secondary="800 points"
                  secondaryTypographyProps={{ color: 'textPrimary' }}
                />
              </ListItem>
            </List>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(BottomNav);
