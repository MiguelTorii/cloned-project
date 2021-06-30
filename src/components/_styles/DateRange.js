export default theme => ({
  buttonWrapper: {
    position: 'relative',
    marginTop: theme.spacing()
  },
  picker: {
    display: 'none'
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: theme.circleIn.palette.primaryText1
  },
  hover: {
    '&:hover': {
      backgroundColor: theme.circleIn.palette.action
    }
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled
  },
  highlightNonCurrentMonthDay: {
    color: '#676767'
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  alone: {
    backgroundColor: theme.circleIn.palette.action
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  }
});
