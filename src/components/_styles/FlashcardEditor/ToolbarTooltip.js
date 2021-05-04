import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => ({
  tooltipContainer: {
    textAlign: 'center'
  },
  tooltip: {
    fontSize: 14,
  },
  popper: {
    zIndex: 1500,
  }
}))
