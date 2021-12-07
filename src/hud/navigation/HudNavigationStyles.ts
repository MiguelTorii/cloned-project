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
    backgroundColor: '#1E88E5',
    '&:hover': {
      background: `linear-gradient(
        115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%);`
    }
  },
  parentNavigationIcon: {
    height: '30px',
    width: '30px',
    alignItems: 'center',
    marginLeft: theme.spacing(1 / 2),
    marginRight: theme.spacing(1 / 2)
  },
  parentNavigationMenu: {
    marginTop: theme.spacing(4)
  },
  childToolItem: {
    alignItems: 'left',
    width: '200px'
  },
  childToolIcon: {
    width: '30px',
    marginRight: theme.spacing(1)
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
    marginLeft: theme.spacing(-0.5)
  }
}));
