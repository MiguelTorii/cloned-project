import makeStyles from "@material-ui/core/styles/makeStyles";
export default makeStyles(theme => ({
  root: {
    width: 600
  },
  linkContainer: {
    backgroundColor: '#5F6165',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    boxShadow: '2px 2px 2px 0 #0000002E inset'
  },
  popper: {
    filter: 'drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.25));',
    zIndex: 2500
  },
  tooltip: {
    fontSize: 14,
    fontWeight: 700,
    padding: '8px 12px',
    background: theme.circleIn.palette.tooltipBackground
  },
  arrow: {
    left: 'auto !important',
    right: 4,
    color: theme.circleIn.palette.tooltipBackground
  }
}));