import { makeStyles } from "@material-ui/core/styles";
import { dialogStyle } from "./Dialog";
const useStyles = makeStyles(theme => ({
  dialog: { ...dialogStyle,
    backgroundColor: theme.circleIn.palette.appBar,
    width: 600,
    borderRadius: 10
  },
  contentClassName: {
    padding: '0px !important'
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid rgba(233, 236, 239, 0.25)`,
    padding: theme.spacing(1.5, 0)
  },
  label: {
    color: 'white',
    fontWeight: 700
  },
  closeIcon: {
    position: 'absolute',
    right: 20
  },
  content: {
    padding: theme.spacing(3)
  }
}));
export default useStyles;