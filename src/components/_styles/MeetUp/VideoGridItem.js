export const centerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
export const styles = theme => ({
  root: {
    ...centerStyles,
    height: '100%',
    flex: 1,
    position: 'relative'
  },
  videoWrapper: {
    ...centerStyles,
    height: '100%',
    width: '100%',
    backgroundColor: theme.circleIn.palette.black,
    position: 'relative',
  },
  video: {
    height: '100% !important',
    width: '100%',
    '& video': {
      width: '100%',
      height: '100%   !important',
      objectFit: 'container',
      boxSizing: 'border-box',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    }
  },
  cameraVideo: {
    '& video': {
      transform: 'rotateY(180deg)',
      '-webkit-transform': 'rotateY(180deg)', /* Safari and Chrome */
      '-moz-transform': 'rotateY(180deg)' /* Firefox */
    }
  },
  shareScreen: {
    '& video': {
      transform: 'rotateY(360deg)',
      '-webkit-transform': 'rotateY(360deg)', /* Safari and Chrome */
      '-moz-transform': 'rotateY(360deg)' /* Firefox */
    }
  },
  singleAvataravatar: {
    ...centerStyles,
    flexDirection: 'column',
    width: '50%',
    height: '50%'
  },
  avatar: {
    ...centerStyles,
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  screen: {
    height: '100%   !important',
    width: '100%    !important',
    '& video': {
      width: '100%    !important',
      height: '100%   !important',
      maxHeight: '100%    !important'
    }
  },
  mic: {
    ...centerStyles,
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(44, 45, 45, .75)',
    zIndex: 9,
    minWidth: 200,
    minHeight: 50,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      minWidth: 130,
      minHeight: 35,
    },
  },
  hidden: {
    display: 'none'
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: theme.spacing(2)
  },
  username: {
    fontWeight: 'bold',
    fontSize: '1vw',
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  },
  black: {
    ...centerStyles,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  initials: {
    fontWeight: 700,
    fontSize: '9vw',
    color: '#000000'
  },
  profile: {
    ...centerStyles,
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  singleProfile: {
    ...centerStyles,
    maxWidth: 350,
    maxHeight: 250,
    width: '100%',
    height: '100%',
    backgroundColor: theme.circleIn.palette.videoThumbDefaultBackground,
  },
  avatarImage: {
    objectFit: 'fill'
  },
  shareGalleryView: {
    flexBasis: 'auto',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    overflowY: 'scroll'
  },
  prevPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    left: 15,
    zIndex: '1400',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  nextPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    right: 15,
    zIndex: '1400',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  labelButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  activeColor: {
    color: theme.circleIn.palette.brand
  }
})