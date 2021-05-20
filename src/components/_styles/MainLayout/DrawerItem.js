import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  menuIcon: {
    marginRight: theme.spacing(),
    minHeight: 28,
    minWidth: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
}))