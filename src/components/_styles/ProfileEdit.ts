import { dialogStyle } from "./Dialog";
export const styles = theme => ({
  form: {
    width: '100%',
    // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    margin: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarButton: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    position: 'relative'
  },
  avatar: {
    width: 80,
    height: 80
  },
  upload: {
    margin: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  progress: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: '50%',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  shrink: {
    fontSize: 20
  },
  dialog: { ...dialogStyle,
    width: 600
  }
});