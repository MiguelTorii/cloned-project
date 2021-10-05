import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2)
  },
  title: {
    fontWeight: 700
  },
  goalItem: {
    width: '20%',
    [theme.breakpoints.down('md')]: {
      width: '25%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '33.333%'
    }
  },
  reportButton: {
    fontWeight: 700,
    color: theme.circleIn.palette.primaryii222
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1)
  },
  helpTitle: {
    fontSize: 26,
    fontWeight: 700
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 700
  },
  goalDescription: {
    fontSize: 14
  },
  helpModalContent: {
    borderColor: '#E9ECEF41',
    padding: theme.spacing(2)
  },
  modalContentData: {
    maxHeight: 400,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  helpModalActions: {
    padding: theme.spacing(3)
  },
  reportImage: {
    maxHeight: 200
  },
  studyGoalImage: {
    width: 54,
    height: 54
  }
}));
