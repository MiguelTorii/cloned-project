export const styles = () => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 0
  },
  videoWrapper: {
    height: 60,
    width: 120,
    minHeight: 60,
    minWidth: 120,
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 4,
    position: 'relative'
  },
  video: {
    height: '100%   !important',
    width: 'auto    !important',
    maxWidth: '120px !important',
    '& video': {
      width: 'auto    !important',
      maxWidth: '120px !important',
      height: '100%   !important'
    }
  },
  content: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  media: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%'
  },
  icon: {
    color: 'white',
    width: 16,
    height: 16
  }
});
