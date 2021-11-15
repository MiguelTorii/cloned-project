import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { ExperienceBarState } from '../experienceBarState/hudExperienceBarState';

// const experienceBarPoints: number = useSelector(
//   (state: { hudExperienceBar: ExperienceBarState }) => state.hudExperienceBar.experienceBarPoints
// );

export const useStyles = makeStyles((theme: any) => ({
  experienceBar: {
    backgroundColor: 'gray',
    borderRadius: 50
  },
  experienceFiller: {
    height: '100%',
    backgroundColor: '#3177E7',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out'
  },
  experienceLabel: {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }
}));
