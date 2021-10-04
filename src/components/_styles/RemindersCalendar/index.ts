import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
export const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  content: {
    width: '100%',
    // Fix IE 11 issue.
    marginTop: theme.spacing(),
    display: 'flex',
    flexDirection: 'column'
  },
  calendarPaper: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 520,
    marginTop: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.appBar
  },
  calendar: {
    width: '100%',
    maxWidth: 600,
    height: 400
  },
  red: {
    color: red[500]
  },
  blue: {
    color: blue[500]
  },
  green: {
    color: green[500]
  },
  grey: {
    color: grey[500]
  }
});