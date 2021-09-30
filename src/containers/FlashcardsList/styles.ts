import makeStyles from '@material-ui/core/styles/makeStyles';
export default makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3, 2)
    }
  },
  feedback: {
    cursor: 'pointer'
  },
  betaTag: {
    position: 'absolute',
    top: 145,
    right: 40,
    backgroundColor: theme.circleIn.palette.betaTag,
    color: theme.circleIn.palette.primaryBackground,
    borderRadius: theme.spacing(1 / 2),
    fontWeight: 700
  },
  emptyContent: {
    maxWidth: 570,
    textAlign: 'center'
  }
}));
