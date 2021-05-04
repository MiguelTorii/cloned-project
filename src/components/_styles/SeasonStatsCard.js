export const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: '100%'
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(),
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: 70,
    height: 75,
    borderRadius: 8,
    '-moz-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    '-webkit-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    boxShadow: 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)'
  },
  grandPrize: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(),
    marginTop: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: '100%',
    borderRadius: 8,
    '-moz-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    '-webkit-box-shadow': 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)',
    boxShadow: 'inset 1px 1px 2px 0 rgba(0, 0, 0, 0.25)'
  },
  image: {
    width: 76,
    height: 76,
    minWidth: 76,
    minHeight: 76,
    margin: theme.spacing()
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing()
  },
  title: {
    fontWeight: 'bold'
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  }
});