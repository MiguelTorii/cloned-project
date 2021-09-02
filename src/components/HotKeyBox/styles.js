import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 2)
  },
  title: {
    fontWeight: 700
  },
  key: {
    padding: theme.spacing(0.5),
    border: 'solid 1px #E4E6EA',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 400
  }
}));
