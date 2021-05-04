import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    padding: theme.spacing(2),
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subtitle: {
    color: theme.circleIn.palette.primaryText2,
    paddingBottom: theme.spacing(3),
    fontSize: 16
  },
  image: {
    [theme.breakpoints.down('xs')]: {
      objectFit: 'scale-down',
      width: '50vw'
    }
  }
}))