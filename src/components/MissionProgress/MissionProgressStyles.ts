import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    border: `solid 1px ${theme.circleIn.palette.gray4}`,
    boxShadow: 'inset 0px 5px 13px black',
    borderRadius: 48
  },
  text: {
    color: 'white',
    fontSize: 11,
    position: 'absolute',
    left: 8,
    top: 1
  }
}));
