import makeStyles from "@material-ui/core/styles/makeStyles";
export default makeStyles(theme => ({
  root: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(2),
    borderRadius: 10
  },
  timerBox: {
    borderBottom: 'solid 1px #5F6165',
    marginBottom: theme.spacing(3),
    '&.hand': {
      cursor: 'pointer'
    }
  },
  timeupButton: {
    borderRadius: 100,
    backgroundColor: '#C45960',
    padding: theme.spacing(3 / 4, 3),
    '&:disabled': {
      color: 'white'
    }
  },
  timerSelect: {
    fontSize: 32
  }
}));