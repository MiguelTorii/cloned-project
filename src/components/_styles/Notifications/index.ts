export const styles = (theme) => ({
  root: {
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    height: 450
  },
  notificationTab: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold',
    padding: 0,
    minWidth: 0
  },
  readAllTab: {
    fontSize: 12
  },
  currentWrapper: {
    padding: theme.spacing(0.5, 2)
  },
  wrapper: {
    backgroundColor: '#e9ecef',
    color: 'black !important',
    borderRadius: 24,
    padding: theme.spacing(0.5, 2),
    minHeight: 0
  },
  selectedReadAll: {
    filter:
      'invert(200%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%)'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0
  },
  hide: {
    display: 'none'
  }
});
