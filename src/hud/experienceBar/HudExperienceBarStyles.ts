import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  experienceBarTrack: {
    backgroundColor: theme.circleIn.palette.gray1,
    borderRadius: '50px',
    overflow: 'hidden',
    margin: theme.spacing(1, 4)
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
  }
}));
