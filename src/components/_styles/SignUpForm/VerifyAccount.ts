import green from '@material-ui/core/colors/green';

export const styles = (theme) => ({
  form: {
    width: '100%',
    // Fix IE 11 issue.
    marginTop: theme.spacing()
  },
  hide: {
    display: 'none'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    margin: theme.spacing()
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});
