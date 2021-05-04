import green from '@material-ui/core/colors/green';

export const styles = theme => ({
  submit: {
    fontWeight: 'bold',
    [theme.breakpoints.up('sm')]: {
      width: 160,
    },
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
    },
    display: 'flex',
    flexDirection: 'column',
    border: `solid 1px ${theme.circleIn.palette.borders}`,
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing(3)}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    // justifyContent: 'flex-end'
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative',
    width: '100%',
  },
  divProgress: {
    height: theme.spacing(3)
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  visible: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    // justifyContent: 'flex-end'
  },
  icon: {
    marginRight: theme.spacing()
  }
});