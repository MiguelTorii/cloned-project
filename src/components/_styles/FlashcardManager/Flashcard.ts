export const styles = theme => ({
  actions: {
    display: 'block'
  },
  body: {
    height: 400,
    overflow: 'visible',
    position: 'relative',
    width: 600
  },
  button: {
    borderRadius: theme.spacing(1),
    fontWeight: 'bold',
    letterSpacing: 0.6,
    margin: `0px ${theme.spacing(2)}px`,
    padding: '12px 0px',
    width: 150
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '16px 0px'
  },
  content: {
    background: theme.circleIn.palette.rowSelection,
    display: 'flex',
    height: '100%',
    padding: theme.spacing(3),
    justifyContent: 'center',
    width: '100%'
  },
  image: {
    height: '100%',
    objectFit: 'contain',
    width: '100%'
  },
  label: {
    textAlign: 'center'
  },
  media: {
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '50%'
  },
  text: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: '0px 4px',
    overflow: 'auto',
    width: '50%',
    wordBreak: 'break-word'
  },
  tooltip: {
    background: theme.circleIn.palette.appBar
  },
  tooltipLabel: {
    fontSize: 14,
    letterSpacing: 0.6,
    lineHeight: 1.2
  },
  tooltipArrow: {
    color: theme.circleIn.palette.appBar,
    fontSize: 12
  }
});