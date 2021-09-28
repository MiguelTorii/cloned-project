import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  detailsButton: {
    padding: theme.spacing(0, 1),
    color: theme.circleIn.palette.action,
    '& .MuiButtonBase-root': {
      minHeight: 0
    }
  },
  dragIcon: {
    height: 20
  },
  dragContainer: {
    position: 'absolute',
    left: 0,
    cursor: 'grab'
  },
  item: {
    paddingLeft: theme.spacing(3),
    cursor: 'pointer',
    minHeight: 40,
    position: 'relative'
  },
  chip: {
    color: theme.circleIn.palette.primaryText1,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 12,
    padding: 0,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  itemDetails: {
    cursor: 'pointer',
    textAlign: 'left'
  },
  taskTitle: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 'bold',
    fontSize: 14
  },
  ellipsis: {
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex'
  },
  empty: {
    height: '100%',
    width: '100%'
  },
  iconButton: {
    padding: 0
  }
}));
