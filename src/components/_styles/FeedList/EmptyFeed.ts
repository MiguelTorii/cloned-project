import { makeStyles } from '@material-ui/core/styles';
import { gutterStyle } from '../Gutter';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    ...gutterStyle(theme),
    padding: theme.spacing(),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  marginBottom: {
    marginBottom: theme.spacing()
  },
  container: {
    paddingTop: theme.spacing(),
    width: '100%',
    marginBottom: theme.spacing()
  },
  imgFirst: {
    height: 92,
    objectFir: 'scale-down',
    margin: theme.spacing(0, 1, 0, 1)
  },
  imgSecond: {
    height: 135,
    objectFir: 'scale-down'
  },
  imgThird: {
    height: 190,
    objectFir: 'scale-down'
  },
  buttonLabel: {
    textTransform: 'initial',
    fontWeight: 'bold'
  },
  buttonSuccess: {
    backgroundColor: theme.circleIn.palette.success
  },
  hidden: {
    display: 'none'
  },
  moreIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));
