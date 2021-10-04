import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  show: {
    display: 'inline-flex'
  },
  hide: {
    display: 'none !important'
  },
  btnGroupContainer: {
    minWidth: 400
  },
  circleInLogo: {
    height: 36,
    marginRight: 15,
    width: 36
  },
  delete: {
    color: theme.circleIn.palette.danger,
    height: 18,
    width: 18,
    display: 'inline-block'
  },
  popper: {
    zIndex: 999999
  },
  toolbar: {
    padding: `${theme.spacing(0.5)}px !important`,
    position: 'absolute',
    top: 74,
    right: 55,
    backgroundColor: theme.circleIn.palette.feedBackground,
    border: 'none !important',
    borderRadius: 10,
    '& .ql-toolbar.ql-snow': {
      border: 'none',
      '& > .ql-picker': {
        width: 56
      }
    },
    '& .ql-editor': {
      height: 'calc(100vh - 210px)',
      maxHeight: 'calc(100vh - 210px)',
      [theme.breakpoints.down('xs')]: {
        height: 'calc(100vh - 240px)',
        maxHeight: 'calc(100vh - 240px)'
      },
      background: theme.palette.common.white,
      color: theme.palette.common.black
    }
  },
  editorToolbar: {
    marginBottom: 40
  },
  emoji: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emoIconStyle: {
    width: 20
  },
  exit: {
    fontWeight: 'bold',
    position: 'static'
  },
  exitBtnContainer: {
    margin: 10,
    display: 'inline-block'
  },
  header: {
    display: 'flex'
  },
  innerContainerEditor: {
    display: 'flex',
    flexDirection: 'column',
    '& .quill': {
      flex: 1
    }
  },
  lastSaved: {
    color: theme.circleIn.palette.primaryText2
  },
  saveButton: {
    marginRight: theme.spacing(2)
  },
  savedContainer: {
    position: 'relative',
    display: 'inline-block',
    fontSize: 12,
    marginRight: theme.spacing(2),
    textAlign: 'end',
    flexDirection: 'column'
  },
  savedContainerTop: {
    top: 8
  },
  savedSection: {
    textAlign: 'right',
    padding: '10px 0',
    minWidth: 300,
    width: '100%'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  visible: {
    fontWeight: 'bold',
    color: theme.circleIn.palette.primaryText1
  }
}));