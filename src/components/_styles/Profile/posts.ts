import { gutterStyle } from "../Gutter";
export const styles = theme => ({
  container: {
    height: '100%',
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing(0, 1, 1, 1)
  },
  root: { ...gutterStyle(theme),
    backgroundColor: theme.circleIn.palette.feedBackground,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: 1,
    borderRadius: '0 0 10px 10px'
  },
  nothing: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});