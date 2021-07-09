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
    color: `${theme.circleIn.palette.secondaryText} !important`
  },
  hover: {
    '&:hover': {
      backgroundColor: theme.circleIn.palette.brand
    }
  },
  nonCurrentMonthDay: {
    color: theme.circleIn.palette.secondaryText,
    margin: theme.spacing(1/2, 0)
  },
  highlightNonCurrentMonthDay: {
    color: theme.circleIn.palette.secondaryText
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    margin: theme.spacing(1/2, 0),
    backgroundColor: theme.circleIn.palette.primaryii222
  },
  currentMonthDay: {
    margin: theme.spacing(1/2, 0)
  },
  alone: {
    backgroundColor: theme.circleIn.palette.action
  },
  firstHighlight: {
    extend: 'highlight',
    borderRadius: '50%',
    margin: theme.spacing(1/2),
    fontWeight: 700,
    backgroundColor: theme.circleIn.palette.brand
  },
  endHighlight: {
    extend: 'highlight',
    borderRadius: '50%',
    margin: theme.spacing(1/2),
    fontWeight: 700,
    backgroundColor: theme.circleIn.palette.brand
  },
  deleteIcon: {
    color: theme.circleIn.palette.danger,
    marginLeft: theme.spacing(1)
  }
});
