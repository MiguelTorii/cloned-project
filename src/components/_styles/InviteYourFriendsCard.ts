import { gutterStyle } from "./Gutter";
export const styles = theme => ({
  root: { ...gutterStyle(theme),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: '100%'
  },
  img: {
    width: 65,
    margin: theme.spacing(2)
  },
  referral: {
    width: '100%',
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  referralCode: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    flex: 1,
    height: 40,
    padding: theme.spacing(),
    borderRadius: 10,
    marginRight: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.appBar
  },
  icon: {
    marginRight: theme.spacing()
  },
  button: {
    height: 40,
    backgroundColor: theme.circleIn.palette.success
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  }
});