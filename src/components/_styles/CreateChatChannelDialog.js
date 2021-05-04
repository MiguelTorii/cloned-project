import { dialogStyle } from './Dialog';

export const styles = () => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  input: {
    display: 'none'
  },
  dialog: {
    ...dialogStyle,
    width: 800
  }
});
