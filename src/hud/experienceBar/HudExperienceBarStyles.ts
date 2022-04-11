import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    position: 'relative'
  },
  experienceBarContainer: {
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  experienceBarTrack: {
    backgroundColor: theme.circleIn.palette.expBarBackground,
    borderRadius: '50px',
    overflow: 'hidden',
    width: '100%',
    cursor: 'pointer'
  },
  mvpLoaded: {
    borderRadius: '50px 0 0 50px'
  },
  mvpProgress: {
    position: 'absolute',
    right: -45,
    width: 50
  },
  experienceFiller: {
    height: '30px',
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    textAlign: 'right',
    transition: 'width 1s ease-in-out'
  },
  experienceLabelContainer: {
    position: 'absolute',
    display: 'flex',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  experienceLabel: {
    margin: 'auto',
    color: theme.circleIn.palette.white,
    fontWeight: 'bold',
    lineHeight: '20px'
  },
  expertModeBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  expertModeText: {
    fontWeight: 800,
    fontSize: '18pt',
    color: theme.circleIn.palette.darkActionBlue
  },
  notificationText: {
    fontSize: 24
  },
  experienceBarNotificationWrapper: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  experienceBarNotificationAnimation: {
    animation: '$fadeIn 2.5s ease-out'
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0
    },
    '60%': {
      transform: 'scale(1.2)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0
    }
  },
  tooltip: {
    fontSize: 14
  }
}));
