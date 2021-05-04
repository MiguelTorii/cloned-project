import { dialogStyle } from './Dialog';

export const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
  },
  downloadIosButton: {
    display: 'block',
    color:'#000000',
    textDecoration: 'none',
    fontFamily: 'Helvetica, arial, sans-serif',
    fontSize: 16,
    borderRadius: 8,
    margin: 5,
    height: 45
  },
  downloadAndroidButton: {
    display: 'block',
    color: '#000000',
    textDecoration: 'none',
    fontFamily: 'Helvetica, arial, sans-serif',
    fontSize: 16,
    height: 45,
  },
  downloadColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  downloads: {
    display: 'flex',
    alignItems: 'center',
  },
  dialog: {
    ...dialogStyle,
    width: 600,
  }
});