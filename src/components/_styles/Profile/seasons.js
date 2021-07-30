export const styles = (theme) => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing()
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  tabs: {
    // maxWidth: 600,
    marginBottom: theme.spacing(2)
  },
  helpButton: {
    margin: theme.spacing(2),
    width: 20,
    height: 20,
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    right: 0
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
    height: '100%'
  },
  rankContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
    height: '100%',
    minHeight: 146,
    [theme.breakpoints.down('xs')]: {
      minHeight: 300
    }
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeGridItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  badge: {
    height: 40,
    width: 40
  },
  badgeSelected: {
    height: 100,
    width: 100
  },
  progress: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginBottom: theme.spacing(2)
  },
  tab: {
    fontSize: 20
  }
});
