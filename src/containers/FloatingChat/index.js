// @flow

import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import withRoot from '../../withRoot';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 10000
  },
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
    width: 400
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
  content: {},
  hide: {
    display: 'none'
  }
});

type Props = {
  classes: Object,
  user: UserState
};

type State = {
  open: boolean
};

class FloatingChat extends React.PureComponent<Props, State> {
  state = {
    open: false
  };

  handleOpen = () => this.setState(prevState => ({ open: !prevState.open }));

  render() {
    const {
      classes,
      user: { data: userData }
    } = this.props;
    const { open } = this.state;
    const { userId } = userData;
    if (userId === '') return null;
    return (
      <div className={classes.root}>
        <Paper
          className={cx(classes.paper, open && classes.paperOpen)}
          elevation={24}
        >
          <div className={classes.header}>
            <ButtonBase
              className={classes.headerTitle}
              onClick={this.handleOpen}
            >
              <Typography variant="h6">Chat</Typography>
            </ButtonBase>
            <ButtonBase className={classes.iconButton}>
              <PersonAddIcon />
            </ButtonBase>
            <ButtonBase className={classes.iconButton}>
              <GroupAddIcon />
            </ButtonBase>
          </div>
          <div className={cx(classes.hide, classes.content)}>content</div>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withRoot(withStyles(styles)(FloatingChat)));
