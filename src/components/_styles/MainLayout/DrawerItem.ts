import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto',
    flexShrink: 0,
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    }
  },
  menuIcon: {
    marginRight: theme.spacing(),
    minHeight: 28,
    minWidth: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activePath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.hoverMenu,
    '& span': {
      fontWeight: 'bold'
    },
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(1, 2),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    }
  }
}));
