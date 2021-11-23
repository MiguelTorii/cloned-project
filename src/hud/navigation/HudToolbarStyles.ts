import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  toolButton: {
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.hoverColor} !important`
    }
  },
  textIconButton: {
    width: '60px',
    height: '60px',
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
