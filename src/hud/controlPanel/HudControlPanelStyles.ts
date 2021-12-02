import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  controlPanel: {
    backgroundColor: theme.circleIn.palette.appBar,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  chatNavigation: {
    flexShrink: 0,
    overflow: 'hidden'
  },
  mainNavigation: {
    overflow: 'hidden'
  },
  missionNavigation: {
    flexShrink: 0,
    overflow: 'hidden'
  },
  circleInLogo: {
    height: '100%'
  },
  circleInLogoContainer: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    },
    borderRadius: 0
  }
}));
