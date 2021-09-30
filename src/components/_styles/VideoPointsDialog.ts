import { dialogStyle } from './Dialog';
export const styles = (theme) => ({
  form: {
    width: '100%',
    // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    padding: theme.spacing(2)
  },
  picker: {
    padding: theme.spacing(2)
  },
  wrapper: {
    margin: theme.spacing(),
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  dialog: { ...dialogStyle, width: 600 }
});
