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
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  initialAlertDescription: {
    fontSize: 16
  },
  initialAlertButton: {
    border: `1px solid white`,
    borderRadius: 20,
    padding: theme.spacing(1, 2),
    margin: theme.spacing(2, 0.5)
  },
  communityChannelProfile: {
    fontWeight: 400,
    fontSize: 32,
    backgroundColor: theme.circleIn.palette.communityChannelProfileBg
  }
}))

export default useStyles