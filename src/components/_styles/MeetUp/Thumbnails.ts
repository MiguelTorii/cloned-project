export const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  sideBySideRoot: {
    flexDirection: 'column'
  },
  item: {
    padding: 0
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
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
  prevPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    left: -25,
    zIndex: '1400',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  prevPageSideView: {
    top: -30,
    left: 80,
    paddingTop: theme.spacing(1)
  },
  nextPage: {
    paddingTop: theme.spacing(3),
    position: 'absolute',
    right: -25,
    zIndex: '1400',
    background: 'rgba(24, 25, 26, 0.75)',
    borderRadius: 10
  },
  nextPageSideView: {
    bottom: -30,
    left: 80,
    paddingTop: theme.spacing(1)
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
});
