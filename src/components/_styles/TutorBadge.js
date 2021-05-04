export const styles = theme => ({
  root: {
    marginLeft: theme.spacing()
  },
  colorPrimary: {
    backgroundColor: '#FFE89B',
    color: theme.circleIn.palette.normalButtonText1,
    fontWeight: 900,
    padding: 0,
    borderRadius: 4
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