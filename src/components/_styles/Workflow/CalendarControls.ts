import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing()
  },
  button: {
    fontSize: 18,
    padding: theme.spacing(1, 2)
  },
  today: {
    fontWeight: 'bold',
    marginLeft: theme.spacing()
  },
  iconButton: {
    padding: theme.spacing(),
    '& .MuiSvgIcon-root': {
      fontSize: 20
    }
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },
  titleContainer: {
    position: 'relative'
  },
  addTask: {
    textAlign: 'end'
  }
}));