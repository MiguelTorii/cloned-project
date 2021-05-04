export const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    color: theme.circleIn.palette.primaryText1,
  },
  table: {
    border: 'none',
  },
  tr: {
    cursor: 'pointer',
    backgroundColor: theme.circleIn.palette.modalBackground,
    '&:hover': {
      backgroundColor: `${theme.circleIn.palette.action} !important`,
    },
  },
  trHighlight: {
    backgroundColor: theme.circleIn.palette.appBar
  },
  tdHeader: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    borderBottom: 'none',
    fontSize: 16,
    color: theme.circleIn.palette.primaryText1,
  },
  td: {
    borderBottom: 'none',
    fontSize: 16,
    fontWeight: 700,
    padding: theme.spacing(),
    color: theme.circleIn.palette.primaryText1,
  },
  tdnp: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 700,
    borderBottom: 'none',
    color: theme.circleIn.palette.primaryText1,
  }
});