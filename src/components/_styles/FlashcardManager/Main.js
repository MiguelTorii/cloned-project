import { dialogStyle } from '../Dialog';

export const styles = (theme) => ({
  buttonReset: {
    marginRight: theme.spacing(),
    borderRadius: 8,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    width: 150
  },
  button: {
    borderRadius: 8,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    width: 150
  },
  content: {
    alignSelf: 'center',
    display: 'flex',
    height: '100%',
    width: 800,
    justifyContent: 'space-between',
    marginTop: 50,
    position: 'relative'
  },
  dialogPaper: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  emptyState: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    height: 400,
    justifyContent: 'center',
    letterSpacing: 0.6,
    textAlign: 'center',
    width: 600
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  score: {
    alignItems: 'center',
    background: '#ffffff',
    color: 'black',
    cursor: 'pointer',
    display: 'flex',
    fontSize: theme.spacing(3),
    fontWeight: 'bold',
    height: 75,
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    width: 75
  },
  scoreBox: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: `${theme.spacing(2)}px 0px`,
    marginTop: 0
  },
  scoreLabel: {
    color: theme.circleIn.palette.action
  },
  scores: {
    display: 'flex',
    flexDirection: 'column'
  },
  selected: {
    border: '5px solid #7572f7'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  studyButton: {
    fontSize: 18,
    color: theme.circleIn.palette.primaryText1,
    backgroundColor: theme.circleIn.palette.darkActionBlue,
    fontWeight: 'bold',
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(),
    padding: theme.spacing(1 / 2, 5)
  },
  buttonText: {
    marginLeft: theme.spacing()
  }
});
