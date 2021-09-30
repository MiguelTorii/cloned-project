import { gutterStyle } from './Gutter';
export const styles = (theme) => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing()
  },
  root: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  }
});
