import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  toolButton: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    },
    borderRadius: 0
  },
  toolButtonCompact: {
    width: '56px',
    height: '56px',
    minWidth: '56px',
    minHeight: '56px',
    padding: 0,
    borderRadius: '50%'
  },
  textIconButton: {
    width: '44px',
    height: '44px',
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  verticalToolbar: {
    display: 'flex',
    flexDirection: 'column'
  },
  horizontalToolbar: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  selectedButton: {
    backgroundColor: theme.circleIn.palette.gray1
  }
}));
