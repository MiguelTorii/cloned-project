import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  root: {
    width: 34,
    height: 18,
    padding: 0,
    margin: theme.spacing(1)
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#60b514',
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: '#60b514',
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 16,
    height: 16
  },
  track: {
    borderRadius: 18 / 2,
    border: '1px solid #6d7884',
    backgroundColor: '#6d7884',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}));
