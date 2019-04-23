// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

const styles = theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing.unit,
    width: '100%'
  },
  progress: {
    display: 'flex',
    padding: theme.spacing.unit * 2,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  grow: {
    flex: 1,
    paddingLeft: theme.spacing.unit,
    minWidth: 0,
    textAlign: 'left'
  },
  margin: {
    margin: theme.spacing.unit * 2
  }
});

type Props = {
  classes: Object,
  roomId: string,
  isLoading: boolean,
  imageProfile: string,
  initials: string,
  roomName: string,
  lastMessage: string,
  unReadCount: number,
  onClick: Function
};

class MainChatItem extends React.PureComponent<Props> {
  handleClick = () => {
    const { roomId, onClick } = this.props;
    onClick(roomId);
  };

  render() {
    const {
      classes,
      isLoading,
      imageProfile,
      initials,
      roomName,
      lastMessage,
      unReadCount
    } = this.props;
    if (isLoading)
      return (
        <div className={classes.progress}>
          <CircularProgress size={20} color="secondary" />
        </div>
      );
    return (
      <ButtonBase className={classes.root} onClick={this.handleClick}>
        <Avatar src={imageProfile}>{initials}</Avatar>
        <div className={classes.grow}>
          <Typography variant="subtitle1" noWrap>
            {roomName}
          </Typography>
          <Typography variant="body2" noWrap>
            {lastMessage}
          </Typography>
        </div>
        <Badge
          className={classes.margin}
          badgeContent={unReadCount}
          color="secondary"
        >
          <span />
        </Badge>
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(MainChatItem);
