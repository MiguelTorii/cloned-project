import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: any) => ({
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
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    height: '120px',
    fontSize: 18,
    backgroundColor: theme.circleIn.palette.sendMessageButton,
    borderRadius: 20,
    width: '188px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      left: '10vw'
    }
  },
  imagePhone: {
    height: '200px'
  }
}));
