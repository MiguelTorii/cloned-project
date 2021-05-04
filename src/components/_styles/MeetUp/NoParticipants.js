export const styles = theme => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1400,
    padding: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  text: {
    color: 'white',
    marginBottom: theme.spacing(2)
  }
});