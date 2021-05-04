import { dialogStyle } from './Dialog';

export const styles = () => ({
  button: {
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: '14px',
    margin: 10,
    padding: '9px 18px',
    width: 120,
  },
  buttons: {
    display: 'flex',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  dialog: {
    ...dialogStyle,
    width: 500
  }
});