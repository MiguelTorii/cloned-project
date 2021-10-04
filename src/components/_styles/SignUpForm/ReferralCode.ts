import green from "@material-ui/core/colors/green";
export const styles = theme => ({
  form: {
    width: '100%',
    // Fix IE 11 issue.
    marginTop: theme.spacing()
  },
  hide: {
    display: 'none'
  },
  backButton: {
    left: 0,
    position: 'absolute',
    top: 0
  },
  button: {
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6)
  },
  wrapper: {
    marginTop: 20,
    textAlign: 'center'
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