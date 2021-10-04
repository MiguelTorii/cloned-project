import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(0, 2, 5, 2)
  },
  containerText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    }
  },
  subtitle: {
    fontSize: 48,
    fontStyle: 'italic',
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    }
  },
  description: {
    fontSize: 16,
    maxWidth: 398
  },
  bold: {
    fontSize: 18,
    margin: theme.spacing(2, 0),
    fontWeight: 800
  },
  image: {
    margin: theme.spacing(0, 2)
  },
  qr: {
    objectFit: 'scale-down',
    width: 133
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  imageMessage: {
    position: 'absolute',
    bottom: 36,
    padding: theme.spacing(2),
    fontSize: 18,
    left: 26,
    backgroundColor: 'rgba(0, 133, 255, 0.67)',
    borderRadius: 20,
    width: 188,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      left: '10vw'
    }
  },
  imagePhone: {
    objectFit: 'scale-down',
    width: 419,
    [theme.breakpoints.down('sm')]: {
      width: '40vw'
    }
  }
}));