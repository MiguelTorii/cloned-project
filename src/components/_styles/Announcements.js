import { dialogStyle } from './Dialog';

export const styles = (theme) => ({
  dialog: {
    ...dialogStyle,
    maxWidth: 700
  },
  image: {
    height: 300,
    objectFit: 'contain',
    width: '100%'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24
  },
  row: {
    fontSize: 16
  },
  title: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 28,
    fontStretch: 'normal',
    fontWeight: 500,
    letterSpacing: 1.1,
    marginBottom: 16,
    textAlign: 'center'
  }
});
