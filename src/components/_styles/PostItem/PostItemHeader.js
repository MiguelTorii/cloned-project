export const styles = theme => ({
  feedTypo: {
    fontSize: 24
  },
  backButton: {
    cursor: 'pointer'
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 100,
    padding: theme.spacing()
  },
  body: {
    wordBreak: 'break-word'
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: '50%'
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2)
  },
  markdown: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
});