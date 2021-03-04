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
  width: "calc(100% - 20px)",
  border: '15px solid rgba(255, 255, 255, .3)',
};

const styles = theme => ({
  actionPanel: {
    flexGrow: 1,
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
  logo: {
    maxWidth: 250,
    maxHeight: 60,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
      maxWidth: 200,
    },
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
    [theme.breakpoints.down('md')]: {
      left: 5,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      left: 70,
    }
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
    [theme.breakpoints.down('md')]: {
      height: 300,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      height: 400,
    },
  },
  notesGif: {
    ...gifStyles,
    height: 400,
  },
  wfGifArea: {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    borderRadius: 8,
    width: "calc(100% - 20px)",
    ...centered,
  },
  wfGif: {
    width: "calc(100% - 20px)",
    height: 'auto',
    objectFit: 'cover',
    objectPosition: '100% 50%',
  },
  chatGif: {
    ...gifStyles,
  },
  demoPanel: {
    backgroundImage: 'linear-gradient(135deg,#94daf9, #1e88e5)',
    flexGrow: 1,
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  demoClass: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  femGirl: {
    padding: theme.spacing(3, 3, 0, 5),
    width: '100%'
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
  textRow: {
    fontSize: 18,
    margin: `${theme.spacing(2)}px 0px`,
    textAlign: 'left',
    [theme.breakpoints.down('md')]: {
      fontSize: 16
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: 18,
    }
  },
  textRows: {
    margin: `${theme.spacing(3)}px 0px`,
    maxWidth: 380,
    minHeight: 190,
    [theme.breakpoints.down('md')]: {
      maxWidth: 300
    },
    [theme.breakpoints.between('md', 'lg')]: {
      maxWidth: 340,
    }
  },
  title: {
    fontSize: 32,
    letterSpacing: 1.1,
    textAlign: 'left',
    maxWidth: 375,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: 28,
      maxWidth: 295
    },
    [theme.breakpoints.between('md', 'lg')]: {
      maxWidth: 340,
    }
  },
});

export default styles;