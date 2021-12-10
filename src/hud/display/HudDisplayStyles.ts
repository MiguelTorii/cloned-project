import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  storyAvatarExperienceContainer: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
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
  storyAvatar: {
    height: '70px',
    width: '70px',
    flexShrink: 0,
    zIndex: 2
  },
  storyMessageContainer: {
    overflow: 'hidden',
    zIndex: 2
  },
  experienceBarContainer: {
    overflow: 'hidden',
    width: '100%'
  }
}));
