import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  experienceBarTrack: {
    backgroundColor: theme.circleIn.palette.gray1,
    borderRadius: '50px',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '60%'
  },
  experienceFiller: {
    height: '100%',
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    textAlign: 'right',
    transition: 'width 1s ease-in-out'
  },
  experienceLabel: {
    color: theme.circleIn.palette.white,
    fontWeight: 'bold',
    lineHeight: '20px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
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
  }
}));
