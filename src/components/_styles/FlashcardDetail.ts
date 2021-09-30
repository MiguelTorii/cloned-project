import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
  markdownContainer: {
    marginBottom: theme.spacing(1)
  },
  root: {
    position: 'relative',
    borderRadius: theme.spacing(),
    backgroundColor: theme.circleIn.palette.flashcardBackground,
    padding: theme.spacing(1 / 2),
    width: '99%',
    margin: theme.spacing(1, 0, 1, 0)
  },
  rootItem: {
    padding: theme.spacing(1 / 2),
    width: '99%',
    margin: theme.spacing(1, 0, 1, 0)
  },
  question: {
    position: 'relative',
    wordBreak: 'break-word',
    fontWeight: 'bold'
  },
  answer: {
    position: 'relative',
    fontWeight: 'bold',
    wordBreak: 'break-word',
    borderLeft: '1px solid rgba(255,255,255,0.25)'
  },
  hasImage: {
    marginLeft: 60
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    minWidth: 0
  },
  hidden: {
    display: 'none'
  },
  buttonGroup: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2
  },
  hardCount: {
    margin: theme.spacing(),
    color: '#CDB09E',
    fontSize: 11,
    fontWeight: 'bold'
  }
}));
