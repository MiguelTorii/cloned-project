export default (theme) => ({
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
    width: 300,
    backgroundColor: theme.circleIn.palette.floatChatBackground
  },
  paperExpanded: {
    height: 500,
    width: 500
  },
  header: {
    background: theme.circleIn.palette.floatChatHeader,
    color: theme.circleIn.palette.normalButtonText1,
    borderRadius: theme.spacing(1, 1, 0, 0),
    display: 'flex',
    height: 40
  },
  notificationHeader: {
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  delete: {
    color: theme.circleIn.palette.danger
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(1.5),
    height: 40
  },
  title: {
    maxWidth: 120,
    fontWeight: 700,
    fontSize: 18
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
    height: 460
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
    color: theme.circleIn.palette.normalButtonText1
  },
  settingIcon: {
    width: 20
  }
});
