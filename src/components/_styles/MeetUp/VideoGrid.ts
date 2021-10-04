export const styles = theme => ({
  root: {
    height: 'calc(100vh - 150px)',
    overflow: 'hidden',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  speakerViewRoot: {
    alignItems: 'flex-end'
  },
  sideBySideRoot: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: 'calc(100vh - 175px)'
  },
  sideBySideView: {
    height: 'calc(100% - 100px) !important',
    paddingLeft: `${theme.spacing(0)}px !important`,
    paddingBottom: `${theme.spacing(0)}px !important`
  },
  notGalleyView: {
    height: 'calc(100% - 100px) !important',
    padding: `${theme.spacing(1.5)}px !important`
  },
  paperContainer: {
    width: '100%',
    height: 'calc(100% - 200px)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: theme.spacing(0, 3, 3, 3),
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  galleryViewPaperContainer: {
    maxWidth: 'calc(100% - 300px)',
    flexDirection: 'row-reverse',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  },
  galleryViews: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
  },
  selectedGalleryViewMode: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      height: 100,
      position: 'absolute',
      zIndex: 9,
      right: theme.spacing(5)
    }
  },
  galleryView: {
    overflowY: 'scroll',
    height: '100% !important'
  },
  view: {
    padding: theme.spacing(1.5)
  },
  gridContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: theme.spacing(0, 3, 3, 3)
  },
  initialContainer: {
    position: 'relative',
    width: 'calc(100% - 200px)',
    height: '100%',
    margin: 0,
    padding: theme.spacing(0, 3, 3, 3),
    [theme.breakpoints.down('md')]: {
      width: '100%'
    }
  },
  pr0: {
    paddingRight: 0
  },
  viewGalleryMode: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150,
    maxHeight: 40,
    margin: theme.spacing(3, 3, 3, 0),
    border: `0.5px solid ${theme.circleIn.palette.white}`,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    overflow: 'hidden'
  },
  shareGalleryView: {
    flexDirection: 'column',
    maxWidth: 200,
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    justifyContent: 'flex-start',
    position: 'relative',
    height: 'auto',
    right: 0
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    alignItems: 'center'
  },
  paginationItem: {
    fontSize: 0,
    border: '1px white solid',
    height: 10,
    minWidth: 10,
    margin: theme.spacing(0, 0.5),
    '&.MuiPaginationItem-page.Mui-selected': {
      backgroundColor: 'white'
    }
  },
  sharedGalleryView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: 0,
      background: 'transparent'
    }
  }
});