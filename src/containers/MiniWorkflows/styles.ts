import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(1.5),
    maxWidth: 320
  },
  title: {
    fontWeight: 700
  },
  emptyImage: {
    maxWidth: '100%',
    marginBottom: theme.spacing(1.5)
  },
  taskContainer: {
    backgroundColor: theme.circleIn.palette.appBar,
    padding: theme.spacing(1.5)
  },
  taskDate: {
    fontWeight: 700
  },
  classPill: {
    color: 'white',
    maxWidth: 170,
    marginTop: theme.spacing(1.5)
  }
}));
