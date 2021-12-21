import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    background: theme.circleIn.palette.rightPanelCardBackground,
    borderRadius: 16
  },
  content: {
    padding: theme.spacing(2.5, 2)
  },
  header: {
    padding: theme.spacing(2, 3, 1, 3),
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '100%',
      width: '100%',
      left: 0,
      height: 1,
      background: `linear-gradient(90deg, ${theme.circleIn.palette.hoverColor} 0%, ${theme.circleIn.palette.rightPanelCardBackground} 99.07%)`
    }
  },
  title: {
    fontSize: 18
  }
}));
