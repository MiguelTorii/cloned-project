const styles = theme => ({
  root: {
    padding: theme.spacing(5),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  subtitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(7.5),
  },
  wrapper: {
    width: 413,
    minHeight: 322,
    padding: theme.spacing(0, 4, 5, 4),
  },
  note: {
    width: 300,
    margin: 'auto',
    marginBottom: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  start: {
    maxWidth: 200,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  button1: {
    borderRadius: 200,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0.5,
    height: 33,
  },
  button2: {
    borderRadius: 200,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    fontSize: 20,
    lineHeight: '16px',
    letterSpacing: 0.25,
    width: '100%',
    height: 45,
  },
});

export default styles
