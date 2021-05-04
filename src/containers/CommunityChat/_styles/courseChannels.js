import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  courseLogo: {
    position: 'relative'
  },
  courseBanner: {
    width: '100%',
    minHeight: 100,
    maxHeight: 120,
  },
  courseNameWithLogo: {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.34)',
    color: 'white',
    padding: theme.spacing(1, 2),
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center'
  },
  courseName: {
    width: '100%',
    minHeight: 100,
    boxShadow: '0px 1px 1px #000000'
  },
  name: {
    background: 'rgba(0, 0, 0, 0.34)',
    color: 'white',
    padding: theme.spacing(1, 2),
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center'
  }
}))

export default useStyles