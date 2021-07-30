export default (theme) => ({
  root: {
    color: theme.circleIn.palette.white,
    borderRadius: theme.spacing(5),
    fontWeight: 700,
    padding: 0
  },
  vectorBadgeRoot: {
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    width: 30
  },
  userRoleColor: {
    backgroundColor: theme.circleIn.palette.profileBadgeColor
  },
  colorPrimary: {
    backgroundColor: theme.circleIn.palette.brand
  },
  label: {
    display: 'none'
  },
  labelSmall: {
    padding: 0,
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing()
  },
  iconSmall: {
    margin: 0
  },
  sizeSmall: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    height: 20,
    padding: theme.spacing(0.5)
  }
});
