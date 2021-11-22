import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  appWithHud: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    overflow: 'hidden',
    padding: theme.spacing(2)
  },
  chat: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    paddingRight: theme.spacing(2)
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%'
  },
  mainAction: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  mainControlPanel: {
    flexShrink: 0,
    height: '120px',
    overflow: 'hidden'
  },
  mainHudDisplay: {
    flexShrink: 0,
    height: '120px',
    overflow: 'hidden'
  },
  missions: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    paddingLeft: theme.spacing(2)
  }
}));
