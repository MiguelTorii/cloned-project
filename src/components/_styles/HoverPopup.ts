import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  root: {
    paddingRight: '0 !important',
    overflow: 'hidden',
    display: 'flex',
    '& .MuiPopover-paper': {
      transform: 'translate(-50%, 10px) !important'
    }
  },
  popover: {
    padding: 0,
    pointerEvents: 'none'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    gap: 10,
    border: '0.2px solid #FFFFFF4C',
    borderRadius: theme.spacing(1.25),
    padding: theme.spacing(2),
    maxWidth: 360,
    width: '100%',
    overflow: 'hidden',
    pointerEvents: 'auto',
    '&.flip': {
      marginTop: theme.spacing(-1.5)
    }
  },
  overviewAvatar: {
    width: 90,
    height: 90,
    margin: theme.spacing(2),
    cursor: 'pointer'
  },
  userInfo: {
    textAlign: 'left'
  },
  hasBio: {
    margin: 'auto',
    textAlign: 'center'
  },
  name: {
    fontSize: 16,
    cursor: 'pointer'
  },
  subTitle: {
    fontSize: 14
  },
  buttonBox: {
    width: '100%'
  },
  message: {
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    fontFamily: 'Nunito',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: theme.circleIn.palette.white,
    borderRadius: 20,
    width: 114,
    height: 33
  },
  chatRoom: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    fontFamily: 'Nunito',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    border: `1px solid ${theme.circleIn.palette.white}`,
    color: theme.circleIn.palette.white,
    borderRadius: 20,
    width: 140,
    height: 33
  }
}));