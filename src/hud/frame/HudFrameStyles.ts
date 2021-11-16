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
    overflow: 'hidden'
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  mainAction: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  mainControlPanel: {
    height: '120px',
    overflow: 'hidden'
  },
  missions: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden'
  }
}));
