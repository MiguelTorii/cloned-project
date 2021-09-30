import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
  answer: {
    paddingBottom: theme.spacing()
  },
  answerContent: {
    alignItems: 'center',
    color: theme.circleIn.palette.disabled,
    display: 'flex',
    '& ul': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    },
    '& p': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    }
  },
  button: {
    borderRadius: 8,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    width: 150
  },
  buttons: {
    margin: `${theme.spacing(4)}px 0px`
  },
  choice: {
    color: theme.circleIn.palette.disabled,
    cursor: 'pointer',
    display: 'flex',
    outline: 0,
    outlineStyle: 'none',
    paddingBottom: theme.spacing(),
    position: 'relative',
    '& ol': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    },
    '& p': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    }
  },
  choices: {
    paddingLeft: theme.spacing(3)
  },
  content: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: theme.spacing(),
    padding: theme.spacing(3)
  },
  dialogImage: {
    maxHeight: 600,
    maxWidth: 800,
    objectFit: 'contain'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing()
  },
  image: {
    borderRadius: theme.spacing(),
    height: '100%',
    objectFit: 'cover',
    width: '100%'
  },
  link: {
    border: 'none',
    color: theme.circleIn.palette.brand,
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 0,
    outlineStyle: 'none',
    paddingLeft: theme.spacing(2)
  },
  media: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    height: 100,
    justifyContent: 'center',
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    width: 250
  },
  multiQuestion: {
    paddingBottom: theme.spacing()
  },
  question: {
    alignItems: 'flex-start',
    display: 'flex',
    paddingBottom: theme.spacing()
  },
  questionContent: {
    paddingTop: 8,
    paddingLeft: theme.spacing(2),
    '& p': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    }
  },
  questionSelect: {
    alignItems: 'center',
    display: 'flex',
    position: 'relative'
  },
  questionTitle: {
    display: 'flex',
    fontWeight: 'bold',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    '& p': {
      wordBreak: 'break-word',
      padding: 0,
      margin: 0
    }
  },
  resultIcon: {
    position: 'absolute',
    left: -20
  },
  resultIcon2: {
    left: -10,
    position: 'absolute',
    top: 5
  },
  radioIcon: {
    cursor: 'pointer',
    height: 20,
    marginRight: theme.spacing()
  },
  subtitle: {
    fontSize: 16,
    marginBottom: theme.spacing(2)
  },
  success: {
    color: theme.circleIn.palette.success
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  }
}));
