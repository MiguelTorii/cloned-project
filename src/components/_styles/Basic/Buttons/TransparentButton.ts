import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    borderRadius: 200,
    border: 'solid 1px white',
    padding: theme.spacing(3 / 4, 3),
    background: 'transparent',
    minWidth: (props: any) => (props.compact ? undefined : 160),
    minHeight: 36,
    '&:disabled': {
      color: 'white'
    }
  }
}));
