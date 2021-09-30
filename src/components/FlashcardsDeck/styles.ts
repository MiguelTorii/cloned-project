import makeStyles from '@material-ui/core/styles/makeStyles';
export default makeStyles((theme) => ({
  root: {
    height: 225,
    borderRadius: '10px 10px 12px 12px',
    backgroundColor: theme.circleIn.palette.action,
    padding: theme.spacing(1, 0, 0, 0),
    cursor: 'pointer'
  },
  pastClassRoot: {
    backgroundColor: theme.circleIn.palette.gray3
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: '0 0 10px 10px',
    padding: theme.spacing(3)
  },
  actionBar: {
    margin: theme.spacing(0, -3, -3, -3),
    padding: theme.spacing(2, 3, 3, 3),
    borderRadius: '0 0 10px 10px',
    background: 'linear-gradient(180deg, #3A3B3B 0%, #3A3B3B 49.48%, #222222 100%)'
  },
  actionItem: {
    cursor: 'pointer'
  },
  title: {
    lineHeight: '25px'
  },
  subtitle: {
    color: theme.circleIn.palette.primaryText2
  },
  hidden: {
    display: 'none'
  },
  reportText: {
    color: theme.circleIn.palette.danger
  },
  deleteModal: {
    width: 600,
    background: theme.circleIn.palette.appBar
  },
  deleteButton: {
    backgroundColor: theme.circleIn.palette.danger,
    borderRadius: 50,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    width: 160,
    marginLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: theme.circleIn.palette.danger
    },
    '& span': {
      textTransform: 'uppercase'
    }
  }
}));
