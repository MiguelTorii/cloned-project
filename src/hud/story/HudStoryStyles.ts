import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyAvatarContainer: {
    padding: theme.spacing(1),
    height: '100%',
    width: '100%'
  },
  storyAvatarBackground: {
    background: theme.circleIn.palette.white,
    borderRadius: '50%',
    padding: '2px',
    height: '100%',
    width: '100%'
  },
  storyMessage: {
    opacity: 0.7,
    marginBottom: theme.spacing(1),
    backgroundColor: theme.circleIn.palette.gray3,
    borderRadius: '4px',
    marginTop: theme.spacing(2),
    paddingLeft: '40px',
    overflow: 'hidden'
  }
}));
