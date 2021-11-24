import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyAvatarExperienceContainer: {
    overflow: 'hidden',
    margin: 'auto',
    display: 'grid',
    justifyContent: 'center'
  },
  storyAvatarAndMessage: {
    display: 'grid',
    gridTemplateColumns: '35px 35px 35px 600px'
  },
  storyAvatar: {
    gridColumn: '1 / 3',
    zIndex: 2,
    gridRow: '1 / 3',
    height: '100%',
    width: '100%',
    justifySelf: 'right'
  },
  storyMessage: {
    gridColumn: '2 / 5',
    gridRow: '1',
    overflow: 'hidden'
  },
  experienceBar: {
    overflow: 'hidden',
    width: '100%',
    height: '20px',
    marginBottom: theme.spacing(2),
    gridColumn: '3 / 5'
  }
}));
