export const dialogStyle = {
  borderRadius: 8,
  overflow: 'auto',
}

export const styles = theme => ({
  dialogPaper: dialogStyle,
  contentRoot: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    paddingTop: 8
  },
  container: {
    borderRadius: 8
  },
  btnDisabled: {
    background: `${theme.circleIn.palette.disableButtonColor} !important`,
    color: 'white !important'
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 28,
    fontStretch: 'normal',
    fontWeight: 'bold',
    letterSpacing: 1.1,
    margin: theme.spacing(2, 7),
    textAlign: 'center'
  },
  backIcon: {
    position: 'absolute',
    color: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    left: 24,
    top: 24
  },
  closeIcon: {
    position: 'absolute',
    color: theme.circleIn.palette.primaryText1,
    cursor: 'pointer',
    right: 24,
    top: 24
  },
  hr: {
    background: 'rgba(233, 236, 239, 0.25)',
    border: 'none',
    height: 1,
  },
  button: {
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: '14px',
    padding: '9px 18px'
  },
  buttons: {
    position: 'relative',
    margin: 10
  },
  removeButton: {
    color: theme.circleIn.palette.danger
  },
  headerContainer: {
    height: 80
  }
})