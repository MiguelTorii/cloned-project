export const styles = (theme) => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  logos: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  logo: {
    width: 200
  },
  selected: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: theme.circleIn.palette.action
  },
  options: {
    display: 'none',
    marginTop: theme.spacing(2)
  },
  show: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  button: {
    marginTop: theme.spacing(2)
  }
});
