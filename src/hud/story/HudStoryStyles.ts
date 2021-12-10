import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyAvatarContainer: {
    height: '100%',
    width: '100%'
  },
  storyAvatarBackground: {
    background: theme.circleIn.palette.kobeBackground,
    borderRadius: '50%',
    padding: '10px 2px',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  storyAvatar: {
    height: '100%'
  },
  storyMessage: {
    height: '100%',
    backgroundColor: theme.circleIn.palette.white,
    border: `solid 1px ${theme.circleIn.palette.success}`,
    borderRadius: '4px',
    overflowX: 'hidden',
    overflowY: 'auto',
    color: 'black',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2px 4px 2px 36px'
  }
}));
