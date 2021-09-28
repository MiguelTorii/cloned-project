import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme: any) => ({
  toolbar: {
    textAlign: 'center',
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px !important',
    backgroundColor: theme.circleIn.palette.appBar,
    margin: theme.spacing(1, 1, 1, 0),
    borderRadius: theme.spacing(2),
    '& .ql-formats': {
      marginRight: '0px !important'
    }
  },
  tooltip: {
    fontSize: 14,
    backgroundColor: theme.circleIn.palette.tooltipBackground
  },
  tooltipArrow: {
    '&::before': {
      backgroundColor: theme.circleIn.palette.tooltipBackground
    }
  },
  popper: {
    zIndex: 1500
  },
  uploadFilePopper: {
    zIndex: 1500,
    width: 123,
    textAlign: 'center'
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
  emoji: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center'
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
