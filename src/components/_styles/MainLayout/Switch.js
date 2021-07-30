import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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
        background:
          'linear-gradient(180deg, #3177E7 16.53%, rgba(255, 255, 255, 0) 100%), #03A9F4',
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
