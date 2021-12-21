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
    padding: theme.spacing(2),
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
    height: '30px',
    width: '30px',
    alignItems: 'center',
    marginLeft: theme.spacing(1 / 2),
    marginRight: theme.spacing(1 / 2)
  },
  profileArea: {
    marginLeft: `${theme.spacing(-2)} !important`,
    marginRight: `${theme.spacing(-2)} !important`
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
    width: '35px',
    marginRight: theme.spacing(0.25),
    marginLeft: theme.spacing(-1)
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
    marginLeft: theme.spacing(-0.5)
  }
}));
