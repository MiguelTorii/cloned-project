import { makeStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles(theme => ({
  root: {
    zIndex: '1200 !important'
  },
  icon: {
    height: 36,
    marginLeft: 4,
    marginRight: 20,
    width: 36
  },
  menuItemContent: {
    alignItems: 'center',
    display: 'flex',
    marginRight: 10
  },
  primaryItem: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 20,
    fontWeight: 'bold'
  },
  secondaryItem: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 14
  },
  hr: {
    background: theme.circleIn.palette.appBar,
    border: 'none',
    color: theme.circleIn.palette.appBar,
    height: 2,
    margin: '6px 0px'
  }
}));