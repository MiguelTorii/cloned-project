import green from '@material-ui/core/colors/green';

export const styles = (theme) => ({
  main: {
    width: 'auto',
    display: 'block'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    boxShadow: 'none !important'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    display: 'flex',
    flexDirection: 'column'
  },
  divProgress: {
    height: theme.spacing(3)
  },
  contentClassName: {
    paddingRight: 0,
    paddingLeft: 0
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  visible: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
    // justifyContent: 'flex-end'
  },
  icon: {
    marginRight: theme.spacing()
  },
  anonymousActive: {
    margin: 0,
    paddingLeft: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  wrapper: {
    margin: theme.spacing(),
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%'
  },
  submit: {
    fontWeight: 'bold',
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
    color: theme.circleIn.palette.primaryText1,
    marginRight: theme.spacing(1),
    borderRadius: 100,
    fontSize: 20,
    [theme.breakpoints.up('sm')]: {
      width: 160
    }
  },
  disabled: {
    '&.Mui-disabled': {
      background: theme.circleIn.palette.inactiveColor,
      color: theme.circleIn.palette.whiteText
    }
  },
  mt3: {
    marginTop: theme.spacing(3)
  },
  anonymouslyExplanation: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    fontSize: 12
  },
  breakdown: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    color: theme.circleIn.palette.brand
  },
  divider: {
    backgroundColor: theme.circleIn.palette.dividerColor
  },
  childContent: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  pointItems: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: theme.spacing(2, 0)
  },
  itemMark: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  postItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    minWidth: 100,
    backgroundColor: '#03A9F4',
    borderRadius: 100,
    color: theme.circleIn.palette.primaryBackground
  },
  noteItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    minWidth: 100,
    backgroundColor: '#F5C264',
    borderRadius: 100,
    color: theme.circleIn.palette.primaryBackground
  },
  questionItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    minWidth: 100,
    backgroundColor: '#15A63D',
    borderRadius: 100,
    color: theme.circleIn.palette.primaryBackground
  },
  resourceItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    minWidth: 100,
    backgroundColor: '#9E3CFF',
    borderRadius: 100,
    color: theme.circleIn.palette.primaryBackground
  },
  itemText: {
    maxWidth: 150
  },
  headerTitleClass: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: theme.spacing(1.5),
    zIndex: 999999
  },
  gotIt: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 0)
  },
  btnGotIt: {
    fontWeight: 'bold',
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)',
    color: theme.circleIn.palette.primaryText1,
    borderRadius: 100
  }
});
