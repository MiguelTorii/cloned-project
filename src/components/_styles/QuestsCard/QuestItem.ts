import green from "@material-ui/core/colors/green";
export const styles = theme => ({
  root: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    height: 113,
    width: 113,
    minWidth: 113,
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 8,
    position: 'relative',
    opacity: 0.35,
    transition: 'width 0.5s, height 0.5s, opacity 0.5s',
    display: 'flex',
    flexDirection: 'column'
  },
  current: {
    zIndex: 100,
    opacity: 1,
    height: 156,
    width: 156,
    minWidth: 156,
    marginLeft: -30,
    marginRight: -30
  },
  hiden: {
    position: 'absolute',
    opacity: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerTitle: {
    flex: 1
  },
  removeButton: {
    padding: theme.spacing(1 / 2)
  },
  body: {
    marginTop: theme.spacing(),
    fontSize: 9,
    transition: 'font-size 0.5s'
  },
  bodyCurrent: {
    fontSize: 11.5
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing() // transition: 'padding 0.5s'

  },
  imageWrapperSmall: {// padding: theme.spacing(1/2)
  },
  image: {
    height: 40,
    width: 40,
    transition: 'width 0.5s, height 0.5s'
  },
  imageSmall: {
    height: 20,
    width: 20
  },
  completed: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: theme.spacing(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  completedIcon: {
    color: green[500]
  }
});