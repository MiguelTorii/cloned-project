import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  header: {
    textAlign: 'center',
    fontSize: 42
  },
  text: {
    marginBottom: theme.spacing(),
    fontSize: 12,
  },
  primaryText: {
    fontSize: 16,
    marginBottom: theme.spacing()
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: theme.spacing()
  },
  titleSecondary: {
    fontWeight: 'bold',
    width: '100%',
    fontSize: 18,
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  animation: {
    width: '100%',
    objectFit: 'scale-down',
    height: 220
  },
  borders: {
    borderColor: theme.circleIn.palette.primaryText2,
    borderStyle: 'solid',
    borderWidth: '1px 0 1px 0',
    margin: theme.spacing(1, 0),
    padding: theme.spacing(1, 0)
  },
  itemContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  secondaryImg: {
    height: 90,
  }
}))