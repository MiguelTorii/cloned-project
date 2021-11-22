import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  experienceBarTrack: {
    backgroundColor: theme.circleIn.palette.gray1,
    borderRadius: '50px',
    overflow: 'hidden',
    height: '100%'
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
    margin: '0px 6px 0px 6px'
  }
}));
