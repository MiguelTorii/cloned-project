export const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gallery: {
    width: '100%',
    height: '100%',
    maxHeight: 300,
    overflow: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  button: {
    margin: theme.spacing(),
    width: 120,
    height: 120
  }
});