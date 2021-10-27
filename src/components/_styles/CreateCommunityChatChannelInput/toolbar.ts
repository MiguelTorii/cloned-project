import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme: any) => ({
  toolbar: {
    textAlign: 'center',
    bottom: 0,
    right: theme.spacing(),
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px !important',
    backgroundColor: '#2B2C2C',
    margin: theme.spacing(1.5, 1, 1.5, 0),
    borderRadius: theme.spacing(2),
    '& .ql-formats': {
      marginRight: '0px !important'
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
    top: -24,
    right: 54,
    border: '1px solid',
    borderRadius: 5,
    backgroundColor: theme.circleIn.palette.appBar,
    [theme.breakpoints.down('sm')]: {
      top: -24,
      right: 0
    }
  },
  show: {
    display: 'inline-flex'
  },
  hide: {
    display: 'none !important'
  }
}));
