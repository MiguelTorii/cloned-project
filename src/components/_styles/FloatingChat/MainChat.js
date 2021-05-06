export const styles = theme => ({
  paper: {
    marginRight: theme.spacing(2),
    width: 250,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.circleIn.palette.appBar,
    borderWidth: 0,
    borderStyle: 'solid',
    borderBottomWidth: 0,
    borderColor: theme.circleIn.palette.borderColor,
    transition: 'width 0.25s, height 0.25s'
  },
  paperOpen: {
    height: 400,
    width: 300
  },
  header: {
    background: '#C7D3DA',
    color: theme.circleIn.palette.normalButtonText1,
    borderRadius: theme.spacing(1/2, 1/2, 0, 0),
    display: 'flex',
    minHeight: 40
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    height: 40
  },
  iconButton: {
    paddingRight: theme.spacing()
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1,
  },
  img: {
    color: theme.circleIn.palette.normalButtonText1,
    width: 32,
  },
  content: {
    overflow: 'none',
    height: 'inherit'
  },
  hide: {
    display: 'none'
  },
  items: {
    height: 'inherit',
    paddingBottom: 60,
    overflowY: 'auto'
  },
  margin: {
    marginLeft: theme.spacing(2)
  }
});