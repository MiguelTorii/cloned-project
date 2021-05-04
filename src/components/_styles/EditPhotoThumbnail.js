import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export const styles = theme => ({
  root: {
    // margin: theme.spacing(2),
    backgroundColor: 'white',
    color: 'black',
    position: 'relative',
    width: 100,
    height: 130
  },
  reverse: {
    backgroundColor: 'black'
  },
  error: {
    backgroundColor: red[500]
  },
  preview: {
    width: '100%',
    height: '100%'
  },
  action: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing()
  },
  uploaded: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing()
  },
  retry: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing()
  },
  button: {
    padding: 4,
    backgroundColor: theme.circleIn.customBackground.iconButton
  },
  icon: {
    color: theme.circleIn.palette.normalButtonText1
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  },
  editor: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  },
  actions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing()
  },
  green: {
    color: green[500]
  },
  uploadedIcon: {
    opacity: 0.5
  }
});
