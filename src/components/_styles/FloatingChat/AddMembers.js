import { dialogStyle } from '../Dialog';

export const styles = (theme) => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    height: '65vh',
    marginTop: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  dialog: {
    ...dialogStyle,
    width: 600
  }
});
