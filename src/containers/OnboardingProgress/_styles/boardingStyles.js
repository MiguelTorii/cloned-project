import { dialogStyle } from 'components/Dialog';
import { detect } from 'detect-browser';

const browser = detect();

const centered = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const gifStyles = {
  borderRadius: 8,
  width: 520,
  border: '15px solid rgba(255, 255, 255, .3)',
};

const subtitle = {
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 0.6,
}

const styles = theme => ({
  actionPanel: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'black',
  },
  actionPanelComponent: {
    paddingBottom: theme.spacing(),
  },
  animationPanel: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  logo: {
    maxWidth: 250,
    maxHeight: 60,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
  board: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    display: 'flex',
    margin: `0px ${theme.spacing(4)}px`,
    padding: theme.spacing(4),
    width: '100%',
    '& div': {
      borderRadius: 8,
    },
  },
  boardColumn: {
    marginRight: theme.spacing(4),
    padding: `0px ${theme.spacing(1.5)}px`,
    width: 200,
  },
  boardHeader: {
    height: 30,
    marginBottom: theme.spacing(),
    paddingTop: theme.spacing(1.5),
    ...subtitle,
    letterSpacing: 0,
    fontSize: 20,
  },
  boardTask: {
    boxShadow: '4px 6px 5px -1px rgba(102,102,102,1)',
    backgroundColor: 'white',
    color: theme.circleIn.palette.primaryBackground,
    height: 120,
    padding: theme.spacing(1.5),
    margin: `${theme.spacing(1.5)}px 0px`,
    width: '100%',
    wordBreak: 'break-all',
    ...subtitle,
  },
  button: {
    backgroundImage: 'linear-gradient(135deg, #94daf9, #1e88e5)',
    minWidth: 210,
    boxShadow: 'none',
    borderRadius: 100,
    color: theme.circleIn.palette.primaryText1,
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1, 5),
  },
  buttonLabel: {
    textTransform: 'none',
  },
  sildeButtons: {
    ...centered,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 85,
    color: theme.circleIn.palette.primary,
  },
  backIcon: {
    color: theme.circleIn.palette.primaryBackground,
  },
  shape: {
    backgroundImage: 'linear-gradient(135deg, #94daf9, #1e88e5)',
    border: '0px !important',
  },
  shapeCircle: {
    borderRadius: '50%',
    margin: theme.spacing(4, 1),
    width: 20,
    height: 20,
    border: '1px solid #1e88e5'
  },
  caption: {
    color: theme.circleIn.palette.primaryBackground,
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: theme.spacing(1.5),
    textAlign: 'center',
    width: '100%',
  },
  closeIcon: {
    top: 15,
    left: 15,
    position: 'absolute',
  },
  content: {
    height: '100%',
  },
  domGifArea: {
    ...centered,
    width: '100%',
    height: '100%',
  },
  demoGif: {
    ...gifStyles,
    objectFit: 'cover',
    objectPosition: '100% 44%',
    height: 485,
  },
  notesGif: {
    ...gifStyles,
    height: 400,
  },
  wfGifArea: {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    borderRadius: 8,
    width: 520,
    ...centered,
  },
  wfGif: {
    width: 570,
    height: 535,
    objectFit: 'cover',
    objectPosition: '100% 50%',
  },
  chatGif: {
    ...gifStyles,
  },
  demoPanel: {
    backgroundImage: 'linear-gradient(135deg,#94daf9, #1e88e5)',
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  demoClass: {
    width: '100%',
    display: 'block',
    position: 'relative',
  },
  demoLogo: {
    maxHeight: 80,
    maxWidth: 175,
    position: 'absolute',
    right: 175,
    top: 380,
  },
  dragImg: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 10,
    right: 10,
  },
  dialog: {
    ...dialogStyle,
    borderRadius: 5,
    backgroundColor: 'white',
    height: 700,
    width: 1100,
  },
  contentDialog: {
    padding: '0px !important',
  },
  fontBlack: {
    color: theme.circleIn.palette.primaryBackground,
  },
  form: {
    borderRadius: 8,
    color: '#7b8992',
    position: 'absolute',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(3),
    width: '85%',
    zIndex: 6,
  },
  formContainer: {
    ...centered,
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  formFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formHeader: {
    marginTop: theme.spacing(3),
  },
  formInput: {
    borderRadius: 8,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid #7b8992`,
    paddingLeft: theme.spacing(),
    height: 30,
  },
  formOverlay: {
    background: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 5,
  },
  formRow: {
    marginBottom: theme.spacing(1.25),
  },
  formTitle: {
    color: 'white',
    fontSize: 20,
    borderBottom: `1px solid #7b8992`,
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    height: browser.name === 'safari'
      ? '-webkit-fill-available'
      : '100%',
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: 400,
    position: 'absolute',
    bottom: 20,
  },
  textInput: {
    display: 'block',
    fontSize: 16,
    minWidth: 200,
    '& input': {
      borderBottom: `1px solid white`,
      minWidth: 200,
      textAlign: 'center',
    },
    '& input:focus': {
      borderBottom: `1px solid ${theme.circleIn.palette.action}`,
    },
  },
  textInputRow: {
    margin: `${theme.spacing()}px 0px`,
    width: '100%',
  },
  textRow: {
    fontSize: 18,
    margin: `${theme.spacing(2)}px 0px`,
    textAlign: 'left',
  },
  textRows: {
    margin: `${theme.spacing(3)}px 0px`,
    maxWidth: 380,
    minHeight: 190,
  },
  theresMore: {
    padding: theme.spacing(4),
    flexDirection: 'column',
    ...centered,
  },
  title: {
    fontSize: 32,
    letterSpacing: 1.1,
    textAlign: 'left',
    maxWidth: 375,
    width: '100%'
  },
});

export default styles;