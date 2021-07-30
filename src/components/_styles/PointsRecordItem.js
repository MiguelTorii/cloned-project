import { makeStyles } from '@material-ui/core/styles';

const IMAGE_SIZE = 32;

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3 / 2),
    backgroundColor: theme.circleIn.palette.gray2
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: theme.spacing(1)
  }
}));
