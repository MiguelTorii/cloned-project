import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    borderTopLeftRadius: '.5rem',
    borderTopRightRadius: '.5rem',
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  innerMain: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    overflow: 'auto'
  },
  conversationWrapper: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  createChannelModalOverlay: {
    height: '100vh',
    width: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000
  },
  createChannelModalInner: {
    width: '95%',
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  createChannelModalRoot: {
    minWidth: 0
  }
}));
