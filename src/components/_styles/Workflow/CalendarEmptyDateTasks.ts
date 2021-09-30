import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
  iconInsert: {
    position: 'absolute',
    bottom: -4,
    left: -10
  },
  tooltip: {
    fontSize: 14
  },
  title: {
    maxWidth: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'bold'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'grab',
    marginBottom: theme.spacing(1 / 2),
    borderRadius: theme.spacing(1 / 2),
    padding: theme.spacing(1 / 2),
    fontSize: 12
  },
  popper: {
    padding: theme.spacing(),
    borderRadius: theme.spacing(),
    background: theme.circleIn.palette.flashcardBackground
  },
  innerPopper: {
    maxHeight: 100,
    overflow: 'auto'
  },
  dragIcon: {
    fontSize: 14
  }
}));
