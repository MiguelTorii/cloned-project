export const styles = theme => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonActions: {
    display: 'flex'
  },
  buttonText: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.primaryColor,
    marginRight: theme.spacing(3)
  },
  actionIcon: {
    fontSize: 16,
    marginRight: theme.spacing(1)
  }
});