import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  navLink: {
    maxHeight: 32
  },
  unreadMessageChannel: {
    color: 'white',
    fontWeight: 700,
    paddingRight: theme.spacing(1 / 2)
  },
  childChannel: {
    paddingLeft: theme.spacing(5)
  },
  selected: {
    backgroundColor: `${theme.circleIn.palette.modalBackground} !important`
  },
  channelName: {
    fontSize: 14,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  channelIcon: {
    minWidth: 16
  },
  selectedChannel: {
    color: 'white'
  },
  hide: {
    display: 'none'
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    overflowX: 'hidden'
  },
  listItem: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  badge: {
    transform: 'none',
    position: 'static'
  }
}));
