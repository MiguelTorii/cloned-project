import { dialogStyle } from './Dialog';

export default (theme) => ({
  validatorForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  input: {
    display: 'none'
  },
  dialog: {
    ...dialogStyle,
    backgroundColor: theme.circleIn.palette.appBar,
    width: 500
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: 'white',
    fontWeight: 700
  },
  searchMember: {
    color: 'white',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1.5),
    '& > :first-child': {
      width: '100%'
    }
  },
  okButtonClass: {
    width: '100%',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    margin: theme.spacing(0, 1),
    borderRadius: theme.spacing(5),
    color: 'white'
  },
  contentClassName: {
    paddingBottom: 0
  }
});
