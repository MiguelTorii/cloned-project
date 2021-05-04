import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  item: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(1, 2, 1, 2),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  currentPath: {
    '& span': {
      fontWeight: 'bold',
    },
    background: theme.circleIn.palette.hoverMenu,
  },
  otherPath: {
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  classes: {
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    textAlign: 'center'
  },
  typo: {
    // textOverflow: 'ellipsis',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    marginLeft: theme.spacing(2),
  },
  menuIcon: {
    marginRight: theme.spacing(),
    alignItems: 'center',
    justifyContent: 'center'
  }
}))