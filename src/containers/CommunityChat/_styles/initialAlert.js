import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3)
  },
  avatarProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    color: 'white',
    border: '2px solid white',
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