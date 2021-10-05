import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme: any) => ({
  postHeaderRoot: {
    padding: theme.spacing(1)
  },
  postHeaderPaper: {
    padding: theme.spacing(2, 3)
  },
  postAnyButton: {
    display: 'flex',
    justifyContent: 'start',
    background: theme.circleIn.palette.appBar,
    borderRadius: 100,
    padding: theme.spacing(1, 2)
  },
  divider: {
    borderColor: 'rgba(255, 255, 255, .25)'
  },
  postButton: {
    minHeight: 40,
    borderRadius: 10,
    padding: theme.spacing(0, 2),
    fontWeight: 600,
    width: '100%',
    '&:hover': {
      backgroundColor: 'rgb(196, 196, 196, .5)'
    }
  }
}));
