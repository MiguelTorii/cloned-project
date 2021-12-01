import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
  appWithHud: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column'
  },
  appNavbar: {
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden'
  },
  appContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    margin: 'auto',
    maxWidth: '100%'
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
  mainHudDisplay: {
    flexShrink: 0,
    overflow: 'hidden'
  },
  missions: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    padding: theme.spacing(2)
  }
}));
