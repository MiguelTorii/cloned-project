export const styles = theme => ({
  icon: {
    marginRight: theme.spacing()
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  link: {
    padding: theme.spacing(),
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    borderRadius: 4,
    marginRight: theme.spacing(2)
  }
});