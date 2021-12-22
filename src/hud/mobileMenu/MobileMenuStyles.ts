import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.circleIn.palette.formBackground
  },
  mobileNavMenu: {
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  mobileNavItem: {
    padding: theme.spacing(0, 2)
  },
  navbarChat: {
    color: theme.circleIn.palette.navbarChatFontColor
  },
  navbarClasses: {
    color: theme.circleIn.palette.navbarClassesFontColor
  },
  navbarLeaderboard: {
    color: theme.circleIn.palette.navbarLeaderboardFontColor
  }
}));

export default useStyles;
