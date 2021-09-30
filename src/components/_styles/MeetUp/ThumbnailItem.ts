export const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
    margin: theme.spacing(0.5),
    height: '100%',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(1.5)
    }
  },
  hide: {
    display: 'none !important'
  },
  mic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(0.5),
    backgroundColor: 'rgba(44, 45, 45, .75)',
    zIndex: 999,
    minWidth: 130,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5)
    }
  },
  profile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  videoWrapper: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 130,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      width: 150,
      height: 100
    }
  },
  video: {
    height: '100%   !important',
    width: '100%    !important',
    '& video': {
      width: '100%',
      height: '100%   !important',
      objectFit: 'container',
      boxSizing: 'border-box',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
    }
  },
  avatarImage: {
    width: '80%',
    objectFit: 'fill'
  },
  content: {
    position: 'absolute',
    bottom: 12,
    right: 12
  },
  title: {
    color: 'black',
    marginLeft: theme.spacing()
  },
  media: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  icon: {
    color: 'white',
    width: 14,
    height: 14,
    marginRight: theme.spacing(1)
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  initials: {
    fontWeight: 700,
    fontSize: 50,
    color: '#000000'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  black: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  username: {
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: theme.spacing(3)
  },
  cameraVideo: {
    '& video': {
      transform: 'rotateY(180deg)',
      '-webkit-transform': 'rotateY(180deg)',

      /* Safari and Chrome */
      '-moz-transform': 'rotateY(180deg)'
      /* Firefox */
    }
  }
});
