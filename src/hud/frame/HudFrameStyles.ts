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
    width: '100%'
  },
  standardAppContent: {
    maxWidth: '1200px'
  },
  wideAppContent: {
    maxWidth: '1600px'
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%'
  },
  mainHeader: {},
  mainAction: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  mainFooter: {
    flexShrink: 0,
    overflow: 'hidden'
  },
  rightPanel: {
    width: '270px',
    flexShrink: 0,
    overflow: 'hidden',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  studyTools: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    overflow: 'hidden'
  },
  missions: {
    flexGrow: 1,
    overflow: 'auto'
  }
}));
