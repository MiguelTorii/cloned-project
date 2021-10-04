export const styles = theme => ({
  useCase: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
    width: 400
  },
  row: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 22,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 16,
    margin: '8px 0',
    textAlign: 'center'
  },
  item: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    marginTop: 4
  },
  itemTitle: {
    color: theme.circleIn.palette.action,
    fontSize: 16,
    letterSpacing: 0.5,
    marginLeft: 24
  },
  icon: {
    height: 36,
    width: 36
  },
  text2: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center'
  },
  action: {
    color: theme.circleIn.palette.action,
    textDecoration: 'none'
  }
});