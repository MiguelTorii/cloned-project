// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import RemoveIcon from '@material-ui/icons/Remove';

const styles = theme => ({
  paper: {
    marginRight: theme.spacing.unit * 2,
    width: 250,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.circleIn.palette.action,
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
  }
});

type Props = {
  classes: Object
};

type State = {
  open: boolean
};

class ChatItem extends React.PureComponent<Props, State> {
  state = {
    open: true
  };

  handleOpen = () => this.setState(prevState => ({ open: !prevState.open }));

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <Paper
        className={cx(classes.paper, open && classes.paperOpen)}
        elevation={24}
      >
        <div className={classes.header}>
          <ButtonBase className={classes.headerTitle} onClick={this.handleOpen}>
            <Typography variant="h6">Chat</Typography>
          </ButtonBase>
          <ButtonBase className={classes.iconButton}>
            <PersonAddIcon />
          </ButtonBase>
          <ButtonBase className={classes.iconButton}>
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
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ChatItem);
