import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  item: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(3),
    '&:hover': {
      background: theme.circleIn.palette.primaryText2
    },
  },
  currentPath: {
    background: theme.circleIn.palette.modalBackground,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  }
}))