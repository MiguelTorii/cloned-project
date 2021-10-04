export const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    margin: theme.spacing(),
    display: 'flex'
  },
  avatar: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.primary.main,
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    marginRight: theme.spacing()
  },
  card: {
    width: 180,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 'auto',
    maxWidth: 120,
    height: 'auto',
    maxHeight: 50
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  }
});