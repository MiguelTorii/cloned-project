import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  textRoot: {
    width: 0
  },
  fullname: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.circleIn.palette.primaryText1
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sendMessage: {
    fontWeight: 'bold',
    backgroundColor: theme.circleIn.palette.sendMessageButton,
    borderRadius: theme.spacing(2),
    minWidth: 163,
    color: theme.circleIn.palette.textOffwhite
  },
  videoChat: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.brand,
    minWidth: 163,
    borderRadius: theme.spacing(2)
  },
  invite: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.brand,
    borderRadius: theme.spacing(2)
  },
  invited: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.textOffwhite,
    minWidth: 163,
    marginLeft: theme.spacing(),
    backgroundColor: theme.circleIn.palette.disabled,
    borderRadius: theme.spacing(2)
  },
  avatarProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    color: 'white'
  },
  circleCheck: {
    color: theme.circleIn.palette.white
  }
}));