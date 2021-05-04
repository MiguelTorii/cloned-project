export const styles = theme => ({
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
  paperExpanded: {
    height: 500,
    width: 500
  },
  header: {
    background: '#C7D3DA',
    color: theme.circleIn.palette.normalButtonText1,
    display: 'flex',
    height: 40,
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1,
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
  titleExpanded: {
    maxWidth: 320
  },
  iconButton: {
    padding: theme.spacing()
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: 360,
    justifyContent: 'space-between'
  },
  contentExpanded: {
    height: 460,
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
  },
  expandIcon: {
    transform: 'rotate(45deg)',
    color: theme.circleIn.palette.normalButtonText1,
  }
});