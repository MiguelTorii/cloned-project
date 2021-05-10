import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 6)
  },
  avatarProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    marginBottom: theme.spacing(2),
    color: 'white',
    fontSize: 40,
    fontWeight: 600,
    width: 80,
    height: 80
  },
  members: {
    fontWeight: 700
  },
  initialAlert: {
    fontSize: 16,
    marginTop: theme.spacing()
  }
}))

export default useStyles