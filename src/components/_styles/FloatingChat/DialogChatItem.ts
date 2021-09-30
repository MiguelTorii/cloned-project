export const styles = (theme) => ({
  paper: {
    marginRight: theme.spacing(2),
    width: 250,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomWidth: 0,
    backgroundColor: theme.circleIn.palette.appBar,
    borderColor: theme.circleIn.palette.borderColor,
    transition: 'width 0.25s, height 0.25s'
  },
  paperOpen: {
    height: 400,
    width: 300
  },
  header: {
    display: 'flex',
    minHeight: 40
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    height: 40
  },
  title: {
    maxWidth: 120
  },
  iconButton: {
    padding: theme.spacing()
  },
  content: {
    overflow: 'none',
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column'
  },
  hide: {
    display: 'none'
  },
  items: {
    height: 'inherit',
    paddingBottom: 60,
    overflowY: 'auto'
  },
  menu: {
    zIndex: 2100
  },
  dialog: {
    zIndex: 2100
  }
});
