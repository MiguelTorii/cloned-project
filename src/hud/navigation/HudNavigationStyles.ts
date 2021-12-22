import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  controlPanelMainSection: {
    display: 'flex',
    flexDirection: 'row'
  },
  parentNavigationItemText: {
    fontWeight: 'bold'
  },
  parentNavigationItem: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    height: '100%',
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    },
    borderRadius: 0
  },
  compactParentNavigationItem: {
    padding: theme.spacing(2),
    height: '100%',
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    },
    borderRadius: 0
  },
  selectedButton: {
    backgroundColor: theme.circleIn.palette.gray2
  },
  highlightedButton: {
    zIndex: 2000,
    boxShadow: `0 0 0 ${theme.spacing(1)}px inset ${theme.circleIn.palette.success}`
  },
  parentNavigationIcon: {
    alignItems: 'center'
  },
  parentNavigationMenu: {
    marginTop: theme.spacing(4)
  },
  childToolItem: {
    alignItems: 'left',
    width: '200px',
    '&:hover': {
      backgroundColor: theme.circleIn.palette.appBar
    }
  },
  childToolIcon: {
    marginRight: theme.spacing(0.25),
    marginLeft: 0
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  initials: {
    width: '100%'
  },
  profileBackground: {
    backgroundColor: theme.circleIn.palette.profilebgColor,
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  arrowDropdown: {
    marginLeft: theme.spacing(0.25)
  },
  compactArrowDropdown: {
    marginLeft: 0
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
