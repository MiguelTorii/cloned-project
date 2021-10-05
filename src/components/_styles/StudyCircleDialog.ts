export const styles = (theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  circleContainer: {
    position: 'relative',
    width: 240,
    height: 240,
    padding: theme.spacing(),
    margin: theme.spacing(4),
    border: 'solid 4px',
    borderColor: theme.palette.primary.main,
    borderRadius: '50%'
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    margin: -20
  },
  avatarBig: {
    height: 80,
    width: 80
  },
  avatarSmall: {
    height: 40,
    width: 40
  }
});
