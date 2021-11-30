import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  appWithHud: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    overflow: 'hidden'
  },
  chat: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    padding: theme.spacing(2),
    marginTop: theme.spacing(7)
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    marginTop: theme.spacing(8)
  },
  mainAction: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  mainControlPanel: {
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden',
    position: 'absolute'
  },
  mainHudDisplay: {
    flexShrink: 0,
    overflow: 'hidden'
  },
  missions: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    padding: theme.spacing(2),
    marginTop: theme.spacing(7)
  }
}));
