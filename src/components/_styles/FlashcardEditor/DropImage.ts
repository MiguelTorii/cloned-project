export const styles = (theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  dropZone: {
    position: 'relative',
    width: '100%',
    minHeight: 50,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.borderColor,
    cursor: 'pointer',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  uploadIconSize: {
    paddingTop: theme.spacing(),
    width: 31,
    height: 31
    // color: '#909090'
  }
});
