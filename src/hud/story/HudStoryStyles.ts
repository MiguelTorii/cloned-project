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
    flexGrow: 1
  },
  storyMessage: {
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.7,
    marginBottom: theme.spacing(1),
    backgroundColor: theme.circleIn.palette.gray3,
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    paddingLeft: '60px',
    overflow: 'hidden'
  }
}));
