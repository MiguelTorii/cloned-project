export default (theme) => ({
  tooltip: {
    fontSize: 14
  },
  root: {
    padding: '2px 4px',
    width: '95%',
    margin: '0 auto',
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    backgroundColor: theme.circleIn.palette.floatChatTextAreaBackground
  },
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  textfield: {
    marginLeft: 8,
    flex: 1,
    padding: 0
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  input: {
    display: 'none'
  },
  imgContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 4
  },
  sendMessageIcon: {
    color: theme.circleIn.palette.brand
  },
  clearIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});
