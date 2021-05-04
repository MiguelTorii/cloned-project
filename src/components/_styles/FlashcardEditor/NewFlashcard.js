export const styles = theme => ({
  root: {
    margin: theme.spacing(1, 0),
    width:'100%',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.circleIn.palette.action
  },
  error: {
    backgroundColor: theme.palette.secondary.main
  }
});