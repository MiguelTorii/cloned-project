export default (theme => ({
  closeIcon: {
    position: 'absolute',
    right: theme.spacing(2)
  },
  autoComplete: {
    marginBottom: theme.spacing(2),
    position: 'relative',
    maxWidth: 489
  },
  inputRoot: {
    paddingLeft: `${theme.spacing(4)}px !important`,
    '&> fieldset': {
      border: '1px solid #5F6165 !important'
    }
  },
  loadingDisable: {
    color: 'white'
  },
  loading: {
    width: '20px !important',
    height: '20px !important'
  },
  chip: {
    backgroundColor: 'rgb(196, 89, 96)',
    color: 'white',
    margin: theme.spacing(0, 0.5)
  },
  classIcon: {
    position: 'absolute',
    zIndex: 99,
    top: theme.spacing(2),
    left: theme.spacing()
  },
  disabled: {
    background: '#5F6165 !important',
    color: '#E4E6EA !important'
  },
  createDM: {
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20
  },
  nonError: {
    display: 'none'
  },
  error: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1)
  },
  errorMessage: {
    fontSize: 12,
    color: theme.circleIn.palette.danger
  },
  cancelBtn: {
    color: 'white'
  },
  hashIcon: {
    top: theme.spacing(2.5),
    left: theme.spacing(1.5),
    position: 'absolute',
    zIndex: 99
  },
  selectClass: {
    backgroundColor: '#2B2C2C',
    borderRadius: theme.spacing()
  },
  emptySelectedClass: {
    backgroundColor: '#2B2C2C',
    borderRadius: theme.spacing(),
    '& > label': {
      paddingLeft: theme.spacing(4)
    },
    '& .Mui-focused': {
      paddingLeft: 0
    }
  },
  shortDescription: {
    fontSize: 16,
    margin: theme.spacing(2)
  },
  noOptions: {
    color: 'white'
  }
}));