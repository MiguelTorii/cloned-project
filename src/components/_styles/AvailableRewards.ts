export const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  item: {
    margin: theme.spacing(2),
    borderRadius: 4,
    width: 180,
    height: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  selected: {
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: theme.palette.primary.main
  },
  image: {
    width: 'auto',
    maxWidth: 120,
    height: 'auto',
    maxHeight: 50,
    marginTop: theme.spacing()
  },
  display: {
    width: 180,
    backgroundColor: 'white',
    height: 50,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  displaySelected: {
    borderLeftStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: theme.palette.primary.main,
    borderRightStyle: 'solid',
    borderRightWidth: 4,
    borderRightColor: theme.palette.primary.main
  },
  overlay: {
    position: 'absolute',
    top: 0,
    borderRadius: 4,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  button: {
    margin: theme.spacing(1 / 2)
  } // elevation: {
  //   boxShadow:
  //     '0px 3px 5px -1px rgba(192,192,192,0.2),0px 6px 10px 0px rgba(192,192,192,0.14),0px 1px 18px 0px rgba(192,192,192,0.12)'
  // }
});
