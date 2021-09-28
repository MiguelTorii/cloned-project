export const styles = (theme) => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  root: {
    width: '95%',
    height: '95%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'white',
    cursor: 'crosshair'
  },
  inputWrapper: {
    position: 'absolute',
    display: 'none',
    width: 'auto',
    top: 0,
    left: 0
  },
  showInput: {
    display: 'inline'
  },
  input: {
    color: 'black',
    backgroundColor: 'white'
  },
  inputOptions: {
    position: 'absolute',
    top: -50,
    left: 0
  },
  button: {
    height: 40,
    width: 40
  },
  participant: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: theme.palette.primary.main,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    padding: theme.spacing(1 / 2)
  }
});
