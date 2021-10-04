import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 200,
    border: 'solid 1px white',
    padding: theme.spacing(3 / 4, 3),
    background: 'transparent',
    minWidth: props => props.compact ? undefined : 160,
    minHeight: 36,
    '&:disabled': {
      color: 'white'
    }
  }
}));