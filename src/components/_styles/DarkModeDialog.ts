import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  list: {
    margin: theme.spacing(2, 0),
    '& span': {
      display: 'block'
    }
  },
  title: {
    textAlign: 'center',
    fontSize: 45,
    marginBottom: theme.spacing(4),
    fontWeight: 400
  },
  subtitle: {
    fontSize: 22,
    marginBottom: theme.spacing(2)
  },
  moon: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  star: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  container: {
    position: 'relative'
  },
  textContainer: {
    marginRight: 90,
    marginBottom: theme.spacing(4),
    marginLeft: 128
  },
  dialog: {
    width: 762
  }
}));