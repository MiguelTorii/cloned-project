import { makeStyles } from '@material-ui/core/styles';
import { dialogStyle } from '../Dialog';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(),
    '& .fc-header-toolbar': {
      display: 'none'
    },
    '& .fc-event-title': {
      fontWeight: 'bold',
      maxWidth: 200
    },
    '& .fc-button': {
      textTransform: 'capitalize'
    },
    '& .fc-list-day-cushion': {
      background: theme.circleIn.palette.appBar
    },
    '& .fc-day-today': {
      background: 'rgba(255, 255, 255, 0.1)'
    },
    '& .fc-popover-body ': {
      background: theme.circleIn.palette.modalBackground
    },
    '& .fc-popover-header': {
      background: theme.circleIn.palette.appBar
    },
    '& .fc-daygrid-day-events': {
      minHeight: `${theme.spacing(8)}px !important`
    }
  },
  title: {
    overflowY: 'auto',
    overflowX: 'hidden',
    wordBreak: 'break-word',
    height: '100%',
    width: '90%'
  },
  classColor: {
    width: 8,
    height: 8,
    marginRight: 4,
    borderRadius: '50%'
  },
  eventContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  dialog: { ...dialogStyle, width: 600 },
  archiveTitle: {
    wordBreak: 'break-word',
    fontSize: 20,
    textAlign: 'center'
  }
}));
