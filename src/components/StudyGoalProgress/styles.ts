import { makeStyles } from "@material-ui/core";
export default makeStyles(theme => ({
  title: {
    fontSize: 12,
    textAlign: 'center'
  },
  progress: {
    fontSize: 14,
    textAlign: 'center'
  },
  completed: {
    color: theme.circleIn.palette.primaryii222
  },
  progressBorder: {
    color: theme.circleIn.palette.secondaryText
  }
}));