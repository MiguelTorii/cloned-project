import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    '& .MuiInputLabel-shrink': {
      display: 'none'
    },
    '& .ql-editor.ql-blank::before': {
      fontWeight: 400,
      left: 0,
      right: 0,
      color: theme.circleIn.palette.textSubtitleBody,
      opacity: 1,
      fontSize: 16
    },
    '& > div': {
      maxHeight: 'inherit'
    },
    '& #quill-editor': {
      maxWidth: 380,
      width: 380,
      maxHeight: 200,
      padding: 0
    },
    '& .MuiPaper-elevation8': {
      borderRadius: theme.spacing(2),
      overflow: 'inherit'
    },
    '& .quill': {
      display: 'flex',
      flexDirection: 'column'
    },
    '& .ql-container.ql-snow': {
      border: 'none',
      maxHeight: 'inherit'
    },
    '& .ql-editor': {
      padding: 0,
      maxHeight: 200,
      width: 440,
      height: 200
    }
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 24
  },
  quickNoteRoot: {
    backgroundColor: theme.circleIn.palette.appBar
  },
  noteOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div': {
      minWidth: 240
    }
  },
  lastSaved: {
    marginRight: theme.spacing(2),
    color: theme.circleIn.palette.primaryText2
  },
  savedContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  select: {
    marginBottom: theme.spacing(2)
  },
  menuItem: {
    display: 'flex'
  },
  menuTypeInput: {
    display: 'flex'
  },
  menuTypo: {
    fontWeight: 'bold'
  },
  menuItemList: {
    '&:hover': {
      backgroundColor: theme.circleIn.palette.modalBackground
    }
  },
  selectedMenuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: `${theme.circleIn.palette.modalBackground} !important`
  },
  renderMenu: {
    borderRadius: 20,
    fontWeight: 'bold',
    padding: theme.spacing(0.5, 1),
    fontSize: 14
  },
  button: {
    background: 'linear-gradient(102.03deg, #94DAF9 0%, #1E88E5 100%)',
    borderRadius: theme.spacing(),
    color: theme.circleIn.palette.textOffwhite,
    fontWeight: 'bold'
  },
  stackbar: {
    color: theme.circleIn.palette.primaryText1
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700
  },
  classLabel: {
    fontWeight: 800,
    fontSize: 18,
    color: theme.circleIn.palette.textOffwhite
  },
  menuList: {
    marginTop: 20
  },
  disableBtn: {
    background: `${theme.circleIn.palette.gray3} !important`,
    color: 'white !important'
  }
}));

export default useStyles;
