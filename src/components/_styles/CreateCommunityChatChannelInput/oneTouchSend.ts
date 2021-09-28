export default (theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 1, 2),
    borderBottom: '1px solid rgba(233, 236, 239, 0.25)'
  },
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  typography: {
    fontSize: 20,
    color: 'white'
  }
});
