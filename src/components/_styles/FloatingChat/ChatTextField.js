export const styles = theme => ({
  tooltip: {
    fontSize: 14,
  },
  root: {
    padding: '2px 4px',
    width: '95%',
    margin: '0 auto',
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.circleIn.palette.borderColor,
    backgroundColor: theme.circleIn.palette.appBar
  },
  form: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  textfield: {
    marginLeft: 8,
    flex: 1,
    padding: 0
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  input: {
    display: 'none'
  },
  imgContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 4
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});