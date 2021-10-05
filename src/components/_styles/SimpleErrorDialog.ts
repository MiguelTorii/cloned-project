import { dialogStyle } from './Dialog';

export const styles = (theme) => ({
  buttons: {
    display: 'flex',
    marginTop: theme.spacing(1.25),
    justifyContent: 'flex-end',
    gap: theme.spacing(1.25)
  },
  button: {
    width: 160
  },
  dialog: { ...dialogStyle, width: 500 }
});
