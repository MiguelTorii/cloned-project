import makeStyles from '@material-ui/core/styles/makeStyles';

export default makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3, 2)
    }
  },
  cardBoardContainer: {
    width: '100%',
    height: 470,
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: 10,
    padding: theme.spacing(1, 3, 3, 3),
    display: 'flex',
    flexDirection: 'column'
  },
  gradientBar: {
    height: 8,
    borderRadius: '10px 10px 0 0',
    margin: theme.spacing(-1, -3, 0, -3),
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)'
  },
  cardBoardContent: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    height: '80%'
  },
  cardBoardTextContainer: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .ql-editor': {
      maxHeight: 'none'
    },
    '& .quill': {
      maxHeight: '100%'
    },
    '& .ql-container': {
      border: '0 !important',
      fontSize: 24
    },
    '&.large-font .ql-container': {
      fontSize: 34
    }
  },
  cardBoardImage: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  cardBoardFooter: {
    height: 60,
    paddingTop: theme.spacing(3),
    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flipButton: {
    fontSize: 20,
    fontWeight: 700,
    '& svg': {
      width: 24,
      height: 24
    }
  },
  hidden: {
    display: 'none'
  },
  moreLessLink: {
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
  },
  reviewModalContent: {
    padding: '0 !important'
  },
  reviewModal: {
    borderRadius: 0
  }
}));
