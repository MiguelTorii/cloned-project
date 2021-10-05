export default (theme) => ({
  dialog: {
    width: 600,
    '& > :first-child': {
      zIndex: 999999
    }
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.circleIn.palette.primaryText1,
    fontSize: 28,
    fontStretch: 'normal',
    fontWeight: 'bold',
    letterSpacing: 1.1,
    margin: theme.spacing(2, 7),
    textAlign: 'center'
  },
  selectForm: {
    marginTop: 50
  },
  nameSelect: {
    '& .MuiSelect-root': {
      padding: theme.spacing(1.25, 1.75)
    },
    '& > svg': {
      display: 'none'
    }
  },
  select: {
    color: theme.circleIn.palette.helperText,
    '& label': {
      color: theme.circleIn.palette.helperText
    }
  },
  InputLabel: {
    backgroundColor: theme.circleIn.palette.gray1
  },
  emptyOption: {
    marginTop: theme.spacing(2)
  },
  helperText: {
    fontWeight: 'letsGonormal',
    fontSize: 14,
    hineHeight: 19,
    color: theme.circleIn.palette.helperText
  },
  noteText: {
    fontWeight: 'normal',
    fontSize: 14,
    hineHeight: 19,
    color: theme.circleIn.palette.helperText,
    marginTop: 20
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    boxShadow: 'none',
    '&.MuiChip-root': {
      backgroundColor: theme.circleIn.palette.chipBackground,
      color: theme.circleIn.palette.secondaryText,
      borderRadius: 4,
      margin: theme.spacing(0.25, 0.25)
    }
  },
  menuItem: {
    color: theme.circleIn.palette.white,
    '&:hover': {
      backgroundColor: theme.circleIn.palette.brand
    }
  },
  mr1: {
    marginRight: `${theme.spacing(1)}px !important`,
    verticalAlign: 'middle'
  },
  report: {
    color: theme.circleIn.palette.danger,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'underline'
  },
  flag: {
    width: 20,
    height: 25
  },
  finalNote: {
    color: theme.circleIn.palette.secondaryText,
    fontSize: 14,
    margin: theme.spacing(4, 3, 3, 3)
  },
  email: {
    color: theme.circleIn.palette.brand,
    textDecoration: 'underline'
  },
  submit: {
    margin: theme.spacing(4, 0),
    minWidth: 220,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)'
  },
  cancel: {
    margin: theme.spacing(4, 0),
    minWidth: 220,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    backgroundColor: theme.circleIn.palette.gray1,
    border: `1px solid ${theme.circleIn.palette.white}`
  }
});
