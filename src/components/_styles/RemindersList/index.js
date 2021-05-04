export const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
      .spacing(3)}px`
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  content: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  listPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 48,
    marginTop: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.appBar
  },
  list: {
    width: '100%'
  }
});