import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(() => ({
  toolbar: {
    textAlign: 'center'
  },
  tooltip: {
    fontSize: 14,
  },
  popper: {
    zIndex: 1500
  },
  openSelectBox: {
    zIndex: 2000
  },
  firstline: {},
  secondline: {},
  hidden: { display: 'none' },
  highlighter: {
    height: 14,
    width: 14,
    '&:hover': {
      color: '#06c'
    }
  },
  highlighterContainer: {
    textAlign: 'center',
    paddingTop: 0.5
  }
}));