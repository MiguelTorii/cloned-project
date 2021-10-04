export default (theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  reply: {
    marginTop: theme.spacing(),
    marginLeft: theme.spacing(4)
  },
  body: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: 80
  },
  textField: {
    marginLeft: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));