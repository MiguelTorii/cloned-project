export const styles = (theme) => ({
  header: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(3),
    backgroundColor: theme.circleIn.palette.appBar
  },
  shareLinkContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: 'inset 2px 2px 2px rgba(0, 0, 0, 0.18)',
    backgroundColor: theme.circleIn.palette.gray3
  },
  copyLink: {
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: theme.spacing(),
    fontWeight: 'bold',
    minWidth: 120
  },
  img: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  imgCopy: {
    cursor: 'pointer'
  },
  link: {
    color: theme.circleIn.palette.textOffwhite,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  // @TODO: upcoming design system can reuse these styles
  popper: {
    filter: 'drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.25));',
  },
  tooltip: {
    fontSize: 14,
    fontWeight: 700,
    padding: '8px 12px',
    background: theme.circleIn.palette.tooltipBackground,
  },
  arrow: {
    left: 'auto !important',
    right: 4,
    color: theme.circleIn.palette.tooltipBackground,
  }
});