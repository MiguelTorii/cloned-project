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
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
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
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
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
  },
  rightPaneToggle: {
    position: 'absolute',
    left: -20,
    top: 40,
    width: 40,
    height: 40,
    backgroundColor: theme.circleIn.palette.modalBackground,
    border: `5px solid ${theme.circleIn.palette.toggleButtonBorder}`,
    '&:hover, &:active': {
      background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
    }
  }
}));
