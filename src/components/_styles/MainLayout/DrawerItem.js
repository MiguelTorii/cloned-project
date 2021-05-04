import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  menuIcon: {
    marginRight: theme.spacing(),
    maxHeight: 28,
    maxWidth: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
}))