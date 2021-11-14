import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyAvatarContainer: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(1)
  },
  storyAvatarBackground: {
    width: '100%',
    height: '100%',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storyAvatar: {
    width: '100%',
    height: '100%'
  },
  storyMessage: {
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.7,
    marginTop: theme.spacing(1)
  }
}));
