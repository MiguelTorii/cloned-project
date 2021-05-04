import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

export const styles = theme => ({
  header: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minHeight: 48,
    backgroundColor: theme.circleIn.palette.appBar
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  picker: {
    margin: theme.spacing()
  },
  label: {
    height: 20,
    width: 20,
    margin: theme.spacing()
  },
  disabled: {
    opacity: 0.3
  },
  blue: {
    backgroundColor: blue[500]
  },
  green: {
    backgroundColor: green[500]
  },
  grey: {
    backgroundColor: grey[500]
  },
  button: {
    margin: theme.spacing()
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});