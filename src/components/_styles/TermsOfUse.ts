export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iframe: {
    backgroundColor: 'white',
    width: '100%',
    height: 500,
    borderRadius: 15
  },
  actions: {
    width: '100%',
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});