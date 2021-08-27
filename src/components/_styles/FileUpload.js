export default (theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    gap: theme.spacing(3),
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    maxWidth: 500,
    minWidth: 370,
    height: 107,
    padding: theme.spacing(1.5, 0, 1.5, 2),
    'word-break': 'break-all',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2),
      maxWidth: 320,
      minWidth: 280,
      height: 55,
      padding: theme.spacing()
    }
  },
  smallContainer: {
    position: 'relative',
    display: 'flex',
    gap: theme.spacing(2),
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    maxWidth: 210,
    minWidth: 210,
    height: 55,
    padding: theme.spacing(1),
    'word-break': 'break-all'
  },
  fileIcon: {
    width: 64,
    minWidth: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > img': {
      width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      width: 24,
      minWidth: 24
    }
  },
  smallFileIcon: {
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
    fontSize: 20,
    lineHeight: '27px',
    height: 27,
    overflow: 'hidden',
    '-webkit-line-clamp': 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  fileName: {
    fontWeight: 800,
    lineHeight: '27px',
    height: 27,
    overflow: 'hidden',
    '-webkit-line-clamp': 1,
    fontSize: 14
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
  },
  downloadIcon: {
    marginLeft: theme.spacing(1)
  }
});
