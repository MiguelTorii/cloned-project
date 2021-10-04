export default (theme => ({
  validatorForm: {
    flex: 1,
    minWidth: 350,
    maxWidth: 520,
    display: 'flex',
    flexDirection: 'column'
  },
  shortDescription: {
    fontSize: 16,
    margin: theme.spacing(2)
  },
  form: {
    width: '100%',
    // Fix IE 11 issue.
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.circleIn.palette.feedBackground,
    borderRadius: theme.spacing(),
    boxSizing: 'border-box',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
    marginBottom: theme.spacing()
  },
  createDM: {
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20
  },
  groupName: {
    marginTop: theme.spacing(),
    backgroundColor: theme.circleIn.palette.feedBackground,
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.gray3
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.circleIn.palette.gray3
    }
  },
  emptyOption: {
    marginTop: theme.spacing(2)
  },
  helperText: {
    color: theme.circleIn.palette.darkTextColor,
    backgroundColor: theme.circleIn.palette.appBar,
    fontSize: 12,
    lineHeight: '16px',
    textAlign: 'right',
    margin: 0
  },
  input: {
    display: 'none'
  },
  labelText: {
    color: `${theme.circleIn.palette.secondaryText} !important`,
    fontSize: 16
  },
  notchedOutline: {
    borderColor: 'white'
  },
  cancelBtn: {
    color: 'white'
  },
  name: {
    color: theme.circleIn.palette.darkTextColor,
    fontSize: 14,
    lineHeight: '19px'
  }
}));