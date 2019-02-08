// @flow

import React from 'react';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import NotificationItem from './notification-item';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object,
  handleNotificationClose: Function
};

type State = { tab: number };

class Notifications extends React.PureComponent<ProvidedProps & Props, State> {
  state = {
    tab: 0
  };

  handleChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes, anchorEl, handleNotificationClose } = this.props;
    const { tab } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Popover
        id="notifications-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
      >
        <Paper className={classes.root}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab label="Study Circle" />
            <Tab label="All" />
          </Tabs>
          <List className={classes.root}>
            {[1, 2, 3, 4].map(item => (
              <NotificationItem key={item} />
            ))}
          </List>
        </Paper>
      </Popover>
    );
  }
}

export default withStyles(styles)(Notifications);
