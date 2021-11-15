import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  chatMessagesPane: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'flex-end',
    overflowY: 'auto',
    maxHeight: '100%'
  },
  chatChannelsPane: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'flex-end',
    overflowY: 'auto',
    maxHeight: '100%',
    borderTop: `1px solid ${theme.circleIn.palette.modalBackground}`
  },
  channelAndMemberList: {
    overflowY: 'auto'
  },
  channelIcon: {
    minWidth: 16
  },
  navLink: {
    maxHeight: 32
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&>:first-child': {
      width: '100%'
    }
  },
  listItem: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  badge: {
    right: theme.spacing()
  },
  channelName: {
    fontSize: 14
  },
  selected: {
    backgroundColor: `${theme.circleIn.palette.modalBackground} !important`
  },
  unreadMessageChannel: {
    color: 'white',
    fontWeight: 700
  },
  communityPicker: {
    borderTop: `2px solid ${theme.circleIn.palette.white}`
  }
}));
