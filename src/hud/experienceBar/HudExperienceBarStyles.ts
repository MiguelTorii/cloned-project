import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  experienceBarTrack: {
    backgroundColor: theme.circleIn.palette.gray1,
    borderRadius: '50px',
    overflow: 'hidden'
  },
  experienceFiller: {
    height: '100%',
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    textAlign: 'right',
    transition: 'width 1s ease-in-out'
  },
  experienceLabel: {
    padding: '5px',
    color: theme.circleIn.palette.white,
    fontWeight: 'bold'
  }
}));
