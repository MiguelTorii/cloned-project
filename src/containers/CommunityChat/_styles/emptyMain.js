import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  messageContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleMessage: {
    marginBottom: theme.spacing(2),
    fontSize: 26,
    color: theme.circleIn.palette.primaryText1,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  subtitleMessage: {
    fontSize: 18,
    color: theme.circleIn.palette.primaryText2,
    marginTop: theme.spacing(),
    textAlign: 'center'
  },
  expertTitle: {
    fontSize: 16,
    fontWeight: 400
  },
  expertContainerText: {
    margin: theme.spacing(2, 0)
  },
  unregisterContainer: {
    height: '100%',
    margin: theme.spacing(0, 2)
  },
  expertContainer: {
    width: '100%',
    height: '100%'
  }
}))

export default useStyles