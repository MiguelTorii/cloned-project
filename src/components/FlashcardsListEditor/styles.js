import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  flashcardEditorRoot: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 8
  },
  flashcardHeader: {
    width: '100%',
    paddingTop: theme.spacing(1),
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.25)'
  },
  flashcardHeaderContent: {
    minHeight: 40,
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(0, 2, 1, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gradientHeader: {
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    borderRadius: theme.spacing(1, 1, 0, 0)
  },
  flashcardContent: {
    padding: theme.spacing(3, 5)
  },
  iconButton: {
    padding: theme.spacing(1 / 4),
    '& svg': {
      color: theme.circleIn.palette.gray3
    },
    '&.active svg': {
      color: theme.circleIn.palette.white
    }
  },
  paddingTopZero: {
    paddingTop: 0
  },
  toolbar: {
    border: '0 !important',
    '& > *': {
      margin: theme.spacing(0, 1),
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, 1 / 3)
      }
    }
  },
  textEditorContainer: {
    position: 'relative',
    height: 104,
    padding: theme.spacing(2, 3 / 2),
    border: 'solid 1px #959595',
    borderRadius: 8,
    backgroundColor: '#35363B',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    '&.active': {
      borderColor: theme.circleIn.palette.brand
    },
    '&.read-only': {
      border: 'none',
      background: 'rgba(95, 97, 101, 0.2)',
      boxShadow: 'inset 2px 2px 2px rgba(0, 0, 0, 0.18)'
    }
  },
  textEditor: {
    flexGrow: 1,
    marginRight: theme.spacing(3 / 2),
    maxWidth: 'calc(100% - 84px)',
    '& .ql-editor': {
      padding: '0 !important'
    },
    '& .quill': {
      height: '100%',
      padding: 0
    },
    '& .ql-container': {
      border: '0 !important',
      fontSize: 18
    }
  },
  imageDnd: {
    width: 72,
    height: 72,
    border: '1px dashed #5F6165',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1 / 2),
    '&.read-only': {
      border: 'none'
    }
  },
  imageIcon: {
    color: '#5F6165'
  },
  thumbnail: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 8
  },
  editorLabel: {
    position: 'absolute',
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(0, 1),
    left: 20,
    top: -12,
    fontSize: 18,
    fontWeight: 800,
    '&.active': {
      color: theme.circleIn.palette.brand
    }
  },
  draggableItem: {
    padding: theme.spacing(1, 0)
  }
}));
