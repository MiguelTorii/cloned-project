import { dialogStyle } from "./Dialog";
export const styles = theme => ({
  circleIn: {
    color: theme.circleIn.palette.action
  },
  list: {
    overflowY: 'scroll'
  },
  stackbar: {
    color: theme.circleIn.palette.primaryText1
  },
  dialog: { ...dialogStyle,
    height: 700,
    width: 700
  },
  optionItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  optionName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  optionButton: {
    borderRadius: 8,
    fontWeight: 'bold',
    marginLeft: 10,
    padding: '2px 16px',
    width: 50
  },
  autocomplete: {
    marginBottom: 20,
    width: '100%'
  },
  paper: {
    background: theme.circleIn.palette.appBar
  }
});