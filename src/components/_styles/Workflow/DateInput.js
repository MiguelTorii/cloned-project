import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
  fixed: {
    '& .react-datepicker-popper': {
      position: 'fixed !important',
      top: 'auto !important',
      left: 'auto !important',
      transform: 'translate3d(-150px, 30px, 100px) !important',
    },
  },
  datePicker: {
    '& .MuiInputBase-input': {
      paddingLeft: theme.spacing(),
      paddingRight: theme.spacing()
    },
    '& .MuiOutlinedInput-adornedStart': {
      padding: 0
    },
    '& .MuiInputAdornment-positionStart': {
      marginRight: 0
    },
    zIndex: 2
  }
}))
