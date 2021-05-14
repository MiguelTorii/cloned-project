export default theme => ({
  root: {
    marginLeft: theme.spacing()
  },
  colorPrimary: {
    backgroundColor: '#15A63D',
    color: theme.circleIn.palette.white,
    fontWeight: 900,
    padding: 0,
    borderRadius: 20
  },
  labelSmall: {
    padding: 0,
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  sizeSmall: {
    height: 16,
    fontSize: 14
  }
})