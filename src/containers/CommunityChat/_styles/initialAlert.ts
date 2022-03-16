import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  root: {
    margin: theme.spacing(0, 6)
  },
  avatarProfile: {
    marginBottom: theme.spacing(2),
    width: 80,
    height: 80
  },
  iconProfile: {
    backgroundColor: theme.circleIn.palette.brand,
    fontWeight: 600,
    color: 'white',
    fontSize: 40
  },
  imageProfile: {
    backgroundColor: theme.circleIn.palette.profilebgColor
  },
  members: {
    fontWeight: 700
  },
  initialAlert: {
    maxWidth: 460,
    fontSize: 16,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
    lineHeight: '24.55px',
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
  },
  avatarImg: {
    marginBottom: theme.spacing(4),
    height: 120
  }
}));
export default useStyles;
