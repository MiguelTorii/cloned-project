import { gutterStyle } from '../Gutter';
export const styles = (theme) => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing(0, 1, 1, 1)
  },
  root: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.circleIn.palette.feedBackground,
    flex: 1,
    borderRadius: '0 0 10px 10px'
  },
  content: {
    marginLeft: theme.spacing(4)
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  }
});
