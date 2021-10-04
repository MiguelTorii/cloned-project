import { makeStyles } from "@material-ui/core/styles";
const text = {
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 1
};
export const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderRadius: theme.spacing(),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3)
  },
  icon: {
    cursor: 'pointer'
  },
  list: {
    display: 'flex',
    flexDirection: isNarrow => isNarrow ? 'column' : 'row'
  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
    marginRight: theme.spacing(4),
    marginBottom: isNarrow => isNarrow ? theme.spacing(2) : 0
  },
  listItemText: { ...text,
    color: '#6d7884'
  },
  listItemTextCompleted: text,
  listItemCheckBox: {
    height: 26,
    paddingRight: theme.spacing(2)
  },
  progress: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: isNarrow => isNarrow ? 'column' : 'row',
    marginTop: theme.spacing(3)
  },
  progressBar: {
    backgroundColor: theme.circleIn.palette.success
  },
  progressColorPrimary: {
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  progressLabel: { ...text,
    marginLeft: isNarrow => isNarrow ? 0 : theme.spacing(2),
    marginTop: isNarrow => isNarrow ? theme.spacing(2) : 0,
    whiteSpace: 'nowrap'
  },
  progressRoot: {
    height: 24
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: theme.spacing()
  },
  titleContainer: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: theme.spacing(2)
  }
}));