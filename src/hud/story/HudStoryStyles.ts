import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyContainer: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative'
  },
  storyMessageBackground: {
    position: 'absolute',
    left: '35px',
    top: theme.spacing(1 / 2),
    bottom: theme.spacing(1 / 2),
    right: 0,
    backgroundColor: theme.circleIn.palette.white,
    border: `solid 1px ${theme.circleIn.palette.success}`,
    borderRadius: '4px'
  },
  storyAvatarContainer: {
    height: '70px',
    width: '70px',
    flexShrink: 0,
    zIndex: 2
  },
  storyMessageContainer: {
    overflow: 'hidden',
    flexGrow: 1,
    zIndex: 2
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
    overflowX: 'hidden',
    overflowY: 'auto',
    color: 'black',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1 / 2, 2)
  },
  closeIcon: {
    color: theme.circleIn.palette.primaryText2,
    zIndex: 2,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1 / 2),
    '&:hover': {
      backgroundColor: theme.circleIn.palette.primaryText1
    }
  }
}));
