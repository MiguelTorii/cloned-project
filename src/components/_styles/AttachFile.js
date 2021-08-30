export default (theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    gap: theme.spacing(1),
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    minWidth: 280,
    maxWidth: 300,
    padding: theme.spacing(1),
    margin: theme.spacing(0.5)
  },
  smallContainer: {
    position: 'relative',
    display: 'flex',
    gap: theme.spacing(1),
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    minWidth: 220,
    maxWidth: 200,
    padding: theme.spacing(1),
    margin: theme.spacing(0.5)
  },
  fileIcon: {
    width: 24,
    minWidth: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > img': {
      width: '100%'
    }
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  name: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '27px',
    height: 27,
    overflow: 'hidden',
    '-webkit-line-clamp': 1
  },
  info: {
    fontSize: 16,
    lineHeight: '22px',
    overflow: 'hidden',
    '-webkit-line-clamp': 1
  },
  progressBar: {
    position: 'relative',
    width: 80,
    height: 2,
    borderRadius: 4,
    background: theme.circleIn.palette.gray3
  },
  content: {
    position: 'absolute',
    height: 2,
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)'
  },
  cancelIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    cursor: 'pointer'
  }
});
