export default (theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    maxWidth: 370,
    minWidth: 370,
    height: 107,
    padding: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 320,
      minWidth: 280,
      height: 55,
      padding: theme.spacing()
    }
  },
  smallContainer: {
    position: 'relative',
    display: 'flex',
    background: '#303032',
    border: '1px solid #5F6165',
    borderRadius: 8,
    color: theme.circleIn.palette.white,
    maxWidth: 210,
    minWidth: 210,
    height: 55,
    padding: theme.spacing(1)
  },
  tooltip: {
    fontSize: 14,
    backgroundColor: theme.circleIn.palette.tooltipBackground
  },
  tooltipArrow: {
    '&::before': {
      backgroundColor: theme.circleIn.palette.tooltipBackground
    }
  },
  download: {
    borderColor: theme.circleIn.palette.secondaryText
  },
  titleTooltip: {
    zIndex: 1500,
    width: 300,
    textAlign: 'center'
  },
  smallTitleTooltip: {
    zIndex: 1500,
    textAlign: 'center'
  },
  fileIcon: {
    width: 64,
    minWidth: 64,
    marginRight: theme.spacing(3),
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
    marginRight: theme.spacing(2),
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
