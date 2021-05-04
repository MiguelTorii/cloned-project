import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  item: {
  },
  headerText: {
    color: theme.circleIn.palette.primaryText2,
    textAlign: 'center'
  },
  classText: {
    color: theme.circleIn.palette.primaryText2,
  },
  columnContainer: {
    display: 'flex',
  },
  container: {
    width: 'fit-content',
    marginRight: theme.spacing()
  }
}))