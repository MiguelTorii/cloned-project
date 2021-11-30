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
    }
  },
  parentNavigationIcon: {
    height: '30px',
    width: '30px',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  parentNavigationMenu: {
    marginTop: theme.spacing(4)
  },
  childToolItem: {
    alignItems: 'left',
    width: '200px'
  },
  childToolIcon: {
    width: '30px'
  }
}));
