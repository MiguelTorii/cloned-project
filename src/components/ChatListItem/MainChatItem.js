// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import GroupIcon from '@material-ui/icons/Group';
import cx from 'classnames';

const styles = theme => ({
  root: {
    display: 'flex',
    padding: theme.spacing(),
    width: '100%'
  },
  dark: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  selected: {
    backgroundColor: theme.circleIn.palette.rowSelection,
  },
  progress: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  grow: {
    flex: 1,
    paddingLeft: theme.spacing(),
    minWidth: 0,
    textAlign: 'left'
  },
  margin: {
    margin: theme.spacing(2)
  }
});

type Props = {
  classes: Object,
  isLoading: boolean,
  imageProfile: string,
  name: string,
  roomName: string,
  lastMessage: string,
  unReadCount: number,
  selected: boolean,
  dark: boolean,
  onClick: Function
};

const MainChatItem = ({
  classes,
  isLoading,
  imageProfile,
  name,
  roomName,
  lastMessage,
  unReadCount,
  dark,
  selected,
  onClick
}: Props) => {
  if (isLoading)
    return (
      <div className={classes.progress}>
        <CircularProgress size={20} color="secondary" />
      </div>
    );

  const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';

  return (
    <ButtonBase
      className={cx(classes.root, {
        [classes.dark]: dark,
        [classes.selected] : selected
      })}
      onClick={onClick}
    >
      <Avatar src={imageProfile}>
        {initials !== '' ? initials : <GroupIcon />}
      </Avatar>
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


export default withStyles(styles)(MainChatItem);
