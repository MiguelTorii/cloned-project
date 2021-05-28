export default theme => ({
  root: {
    marginLeft: theme.spacing(),
    color: theme.circleIn.palette.white,
    borderRadius: theme.spacing(),
    fontWeight: 700,
    padding: 0
  },
  tutorBackground: {
    backgroundColor: '#FFE89B'
  },
  expertBackground: {
    backgroundColor: '#15A63D'
  },
  leaderBackground: {
    backgroundColor: '#1E88E5'
  },
  colorPrimary: {
    backgroundColor: theme.circleIn.palette.brand
  },
  labelSmall: {
    padding: 0,
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  sizeSmall: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    fontSize: 14,
    padding: theme.spacing(0.5)
  }
})