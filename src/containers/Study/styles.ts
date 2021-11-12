import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  pageTitle: {
    fontWeight: 700
  },
  body: {
    maxWidth: 400,
    minWidth: 350
  },
  helpItem: {
    width: '100%',
    backgroundColor: theme.circleIn.palette.feedBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    '& > p': {
      marginTop: theme.spacing(2),
      marginBottom: 0
    },
    '&:hover': {
      backgroundColor: theme.circleIn.palette.hoverColor
    },
    borderRadius: 10
  },
  studyAction: {
    backgroundColor: theme.circleIn.palette.feedBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    width: '100%',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.hoverColor
    }
  },
  studyActionText: {
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginLeft: theme.spacing(2)
  },
  flashcardLink: {
    color: theme.circleIn.palette.primaryii222,
    textDecoration: 'underline'
  }
}));
