export const styles = (theme) => ({
  root: {
    position: 'absolute',
    bottom: 0,
    // width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1400 // backgroundColor: 'white'
  },
  fab: {
    margin: theme.spacing(2)
  },
  hangup: {
    background: 'red',
    margin: theme.spacing(2)
  },
  tooltip: {
    fontSize: 14
  }
});
