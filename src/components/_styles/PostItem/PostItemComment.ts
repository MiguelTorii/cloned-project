import green from "@material-ui/core/colors/green";
export const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: theme.spacing(0, 0, 2, 0)
  },
  reply: {
    marginLeft: theme.spacing(6),
    paddingRight: theme.spacing(6)
  },
  info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1)
  },
  commentArea: {
    backgroundColor: theme.circleIn.palette.appBar,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: theme.spacing(1.5)
  },
  created: {
    paddingLeft: 0
  },
  markdown: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    '& img': {
      maxHeight: '100px !important',
      width: 'auto'
    },
    '& a': {
      color: theme.palette.primary.main
    }
  },
  progress: {
    width: '100%'
  },
  actions: {
    marginTop: theme.spacing(),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  bestAnswer: {
    justifyContent: 'space-between'
  },
  grow: {
    flex: 1
  },
  thanks: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: theme.circleIn.palette.primaryText1
  },
  thanked: {
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: theme.circleIn.palette.brand
  },
  badgeIcon: {
    marginLeft: theme.spacing(0.5)
  },
  actionIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing()
  },
  replyTo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(3 / 2)
  },
  accepted: {
    '&:disabled': {
      backgroundColor: green[500],
      color: 'white'
    }
  },
  link: {
    color: `${theme.circleIn.palette.primaryText1} !important`,
    marginRight: theme.spacing(),
    '&:hover': {
      textDecoration: 'none'
    }
  },
  editContainer: {
    width: '100%',
    margin: theme.spacing(-5, 0),
    '& > div': {
      marginLeft: 0
    }
  },
  bestAnswerChip: {
    backgroundColor: '#15A63D',
    color: 'white',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.5, 1)
  }
});