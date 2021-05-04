import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 200,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    padding: theme.spacing(3/4, 3),
    minWidth: props => props.compact ? undefined : 160,
    minHeight: 36
  }
}))
