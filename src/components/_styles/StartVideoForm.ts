import green from "@material-ui/core/colors/green";
export const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  form: {
    width: '100%',
    // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
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