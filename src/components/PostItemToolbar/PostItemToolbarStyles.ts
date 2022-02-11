import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    '& .ql-formats': {
      display: 'inline-flex',
      marginRight: 0
    }
  },
  tooltip: {
    fontSize: 14
  },
  popper: {
    zIndex: 1500
  },
  openSelectBox: {
    zIndex: 2000
  },
  firstline: {},
  secondline: {},
  hidden: {
    display: 'none'
  },
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
  },
  emoIconStyle: {
    width: 20
  },
  moreHoriz: {
    display: 'flex !important'
  },
  subToolbar: {
    position: 'absolute',
    top: -35,
    right: 120,
    border: '1px solid',
    borderRadius: 5
  },
  subToolbarMobile: {
    top: 35
  },
  show: {
    display: 'inline-flex'
  },
  hide: {
    display: 'none !important'
  }
}));
