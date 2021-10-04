import { makeStyles } from "@material-ui/core/styles";
import { dialogStyle } from "../Dialog";
export const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  },
  hidden: {
    opacity: 0
  },
  iconButton: {
    padding: 0
  },
  dialog: { ...dialogStyle,
    width: 600
  },
  archiveTitle: {
    wordBreak: 'break-word',
    fontSize: 20,
    textAlign: 'center'
  },
  cardItem: {
    width: 245
  },
  listItem: {
    width: '100%'
  }
}));