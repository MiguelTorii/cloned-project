export default (theme) => ({
  container: {
    maxHeight: 'inherit',
    // display: 'flex',
    padding: theme.spacing(),
    position: 'relative',
    minHeight: 400
  },
  root: {
    ...theme.mixins.gutters(),
    backgroundColor: theme.circleIn.palette.feedBackground,
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  marginBottom: {
    marginBottom: theme.spacing()
  },
  loadingText: {
    margin: theme.spacing(2, 0),
    fontSize: 30
  },
  loadingSmallText: {
    fontSize: 20
  },
  title: {
    flex: 1
  },
  title2: {
    color: theme.circleIn.palette.primaryText1,
    paddingBottom: 23,
    paddingTop: 26,
    maxWidth: 740,
    fontSize: 26,
    textAlign: 'center'
  },
  textField: {
    marginLeft: theme.spacing(),
    flex: 1
  },
  items: {
    overflowY: 'auto',
    // maxHeight: 'calc(100vh - 250px)',
    flex: 1,
    marginTop: theme.spacing()
  },
  margin: {
    margin: theme.spacing(2)
  },
  popover: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  progress: {
    width: 180,
    height: 100,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  feedEnd: {
    backgroundColor: theme.circleIn.palette.appBar,
    padding: 10,
    width: '100%'
  },
  endLabel: {
    textAlign: 'center'
  },
  newPost: {
    background: theme.circleIn.palette.brand,
    borderRadius: 20,
    color: 'black',
    display: 'inline',
    fontSize: 22,
    fontWeight: 'bold',
    margin: '0px 3px',
    padding: '0px 16px',
    width: 100
  },
  expertTitle: {
    fontSize: 24,
    fontWeight: 400
  },
  expertContainerText: {
    margin: theme.spacing(2, 0)
  },
  loadingGif: {
    width: 400
  }
});
