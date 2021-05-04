export const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    margin: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.feedBackground
  },
  filtersHeader: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filtersFooter: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  input: {
    marginRight: 8,
    flex: 1,
    borderRadius: 4,
    paddingLeft: 8,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  formControl: {
    margin: theme.spacing(2)
  },
  formButton: {
    marginLeft: theme.spacing(),
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing()
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  },
  filterButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  searchIcon: {
    opacity: 0.3
  }
});