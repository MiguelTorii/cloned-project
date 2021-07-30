export const styles = (theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    position: 'relative'
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fec04f'
  },
  badge: {
    marginLeft: theme.spacing(),
    height: 32,
    width: 32
  },
  grow: {
    flex: 1
  },
  slots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  item: {
    margin: theme.spacing(),
    display: 'flex'
  },
  helpButton: {
    margin: theme.spacing(2),
    width: 20,
    height: 20,
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    right: 0
  },
  helpIcon: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1
  },
  avatar: {
    width: 20,
    height: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    backgroundColor: 'transparent',
    color: theme.circleIn.palette.primaryText1,
    marginRight: theme.spacing()
  },
  card: {
    width: 92,
    height: 92,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 'auto',
    maxWidth: 80,
    height: 'auto',
    maxHeight: 50
  },
  addButton: {
    borderRadius: 4,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.circleIn.palette.primaryText1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 92,
    height: 92
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  },
  link: {
    margin: theme.spacing(),
    color: theme.palette.primary.main
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  circleIn: {
    color: theme.circleIn.palette.action
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentIcon: {
    marginRight: theme.spacing(),
    marginBottom: theme.spacing(2),
    height: 40
  }
});
