import makeStyles from '@material-ui/core/styles/makeStyles';
export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  greetingTitle: {
    fontWeight: 700
  },
  quote: {
    fontSize: 18,
    fontWeight: 600,
    fontStyle: 'italic'
  },
  name: {
    color: theme.circleIn.palette.darkTextColor
  }
}));
