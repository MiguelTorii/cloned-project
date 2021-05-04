import { makeStyles } from '@material-ui/core/styles'
import { dialogStyle } from '../Dialog'

export const useStyles = makeStyles(theme => ({
  dialog: {
    ...dialogStyle,
    height: 700,
    '& > :first-child': {
      zIndex: 999999
    }
  },
  contentClassName: {
    '& > #circle-in-dialog-title': {
      borderBottom: `1px solid ${theme.circleIn.palette.white}`,
      paddingBottom: theme.spacing(3)
    }
  },
  searchInput: {
    padding: theme.spacing(3)
  },
  link: {
    color: theme.circleIn.palette.action,
    cursor: 'pointer',
    display: 'inline',
    paddingLeft: 3
  },
  list: {
    overflowY: 'scroll'
  },
  courseDisplayName: {
    fontSize: 24,
    textDecoration: 'italic',
    padding: '16px 8px',
  }
}))
