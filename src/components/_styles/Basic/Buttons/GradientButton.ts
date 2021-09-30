import { makeStyles } from '@material-ui/core';
export const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 200,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    backgroundColor: theme.circleIn.palette.primaryii222,
    padding: theme.spacing(3 / 4, 3),
    minWidth: (props) => (props.compact ? undefined : 160),
    minHeight: 36,
    '&:disabled': {
      background: theme.circleIn.palette.primaryii222,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25), inset 2px 2px 2px rgba(34, 34, 34, 0.24)',
      color: 'white'
    },
    '&:hover, &:active, &:visited': {
      background: theme.circleIn.palette.primaryii222
    }
  }
}));
