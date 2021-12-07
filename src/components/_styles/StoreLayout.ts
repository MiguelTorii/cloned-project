import { gutterStyle } from './Gutter';

export const styles = (theme) => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing()
  },
  root: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  },
  hudRoot: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(8),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  }
});
