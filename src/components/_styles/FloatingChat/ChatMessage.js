export const styles = (theme) => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(),
    marginBottom: theme.spacing(),
    alignItems: 'flex-start',
    width: '70%'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  name: {
    color: 'white',
    paddingLeft: 0
  },
  message: {
    maxWidth: '100%',
    marginBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  bodyWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column'
  },
  reverse: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  image: {
    borderRadius: 5,
    marginBottom: theme.spacing(),
    maxWidth: 120
  },
  createdAt: {
    paddingLeft: 0,
    color: theme.circleIn.palette.primaryText1
  },
  videoSpace: {
    height: 70,
    width: '100%'
  },
  video: {
    flex: 1,
    position: 'absolute',
    maxWidth: 250,
    width: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    // borderRadius: 20,
    // padding: '5px 10px 5px 10px',
    // backgroundColor: 'grey',
    // wordWrap: 'break-word',
    // minWidth: 270,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
    // marginLeft: -55
    // cursor: 'pointer'
  },
  videoTitle: {
    // textAlign: 'center',
    color: 'white'
  },
  videoSubTitle: {
    textAlign: 'center',
    color: 'white'
  },
  body: {
    flex: 1,
    borderRadius: 20,
    padding: '5px 20px 5px 20px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    color: '#303030',
    wordWrap: 'break-word',
    width: '100%'
    // 'word-break': 'break-all'
  },
  right: {
    textAlign: 'right',
    backgroundColor: '#5dcbfd'
  },
  avatarLink: {
    textDecoration: 'none',
    marginTop: 3
  },
  link: {
    color: theme.palette.primary.main
  }
});
