export const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1400,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  mainControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disalbedRoot: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 0,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    opacity: 0.85
  },
  fab: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  controlButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  controlIcons: {
    height: 40,
    width: 40,
    color: theme.circleIn.palette.white,
    [theme.breakpoints.down('sm')]: {
      height: 30,
      width: 30,
    }
  },
  controlLabel: {
    marginTop: theme.spacing(0.5),
    fontWeight: 700,
    color: theme.circleIn.palette.white,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sharingBtn: {
    color: theme.circleIn.palette.brand
  },
  nonEffect: {
    color: theme.circleIn.palette.danger
  },
  hangup: {
    background: theme.circleIn.palette.dangerBackground,
    border: `1px solid ${theme.circleIn.palette.dangerBackground}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    margin: theme.spacing(2, 3),
    color: theme.circleIn.palette.white,
    '&:hover': {
      background: theme.circleIn.palette.dangerBackground,
      color: theme.circleIn.palette.white,
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 1),
    }
  },
  disableControl: {
    color: `${theme.circleIn.palette.white} !important`,
    backgroundColor: `${theme.circleIn.palette.danger} !important`
  },
  meetingDetailShow: {
    color: theme.circleIn.palette.brand
  },
  meetingDetail: {
    backgroundColor: theme.circleIn.palette.appBar,
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
    margin: theme.spacing(2, 3),
    color: theme.circleIn.palette.white,
    '&:hover': {
      background: theme.circleIn.palette.appBar,
      color: theme.circleIn.palette.white,
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0.5, 1),
    }
  },
  tooltip: {
    fontSize: 14,
  },
  badge: {
    top: 10,
    right: 15,
    zIndex: 1700
  }
});