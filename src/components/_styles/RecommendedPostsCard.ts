import { gutterStyle } from "./Gutter";
export const styles = theme => ({
  root: { ...gutterStyle(theme),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: '100%'
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing(4)
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(),
    padding: theme.spacing(),
    width: 86,
    height: 86,
    backgroundColor: theme.circleIn.palette.appBar
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2)
  },
  icon: {
    height: 40,
    width: 40
  }
});