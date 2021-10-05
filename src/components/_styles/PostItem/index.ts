import { gutterStyle } from '../Gutter';

export const styles = (theme) => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing()
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  link: {
    cursor: 'pointer'
  },
  root: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    backgroundColor: theme.circleIn.palette.feedBackground,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2)
    },
    marginBottom: theme.spacing(8),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  }
});
