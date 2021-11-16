import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  experienceBarTrack: {
    backgroundColor: 'gray',
    borderRadius: '50px'
  },
  experienceFiller: {
    height: '100%',
    backgroundColor: '#3177E7',
    borderRadius: '50px 0px 0px 50px',
    textAlign: 'right',
    transition: 'width 1s ease-in-out'
  },
  experienceLabel: {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }
}));
