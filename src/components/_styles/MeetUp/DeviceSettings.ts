export const styles = (theme) => ({
  dialog: {
    width: 600,
    '& > :first-child': {
      zIndex: 999999
    }
  },
  contentClassName: {
    '& > #circle-in-dialog-title': {
      borderBottom: `1px solid ${theme.circleIn.palette.white}`,
      paddingBottom: theme.spacing(3)
    }
  },
  options: {
    width: '100%',
    padding: theme.spacing(2, 0)
  },
  optionLabel: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.circleIn.palette.secondaryText
  },
  dropdownArrow: {
    color: theme.circleIn.palette.brand,
    fontSize: 28
  },
  controlOptions: {
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10
  },
  selectInput: {
    paddingLeft: theme.spacing(3)
  },
  optionFocused: {
    backgroundColor: theme.circleIn.palette.secondaryText,
    border: `1px solid ${theme.circleIn.palette.appBar}`,
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    color: theme.circleIn.palette.appBar
  },
  controlOptionLabel: {
    '&::before': {
      border: 'none'
    },
    '&:hover:not(.Mui-disabled):before': {
      border: 'none'
    }
  },
  report: {
    color: theme.circleIn.palette.danger,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  letsGo: {
    margin: theme.spacing(4, 0),
    minWidth: 340,
    borderRadius: 20,
    color: theme.circleIn.palette.white,
    fontWeight: 700,
    fontSize: 20,
    background: 'linear-gradient(114.44deg, #94DAF9 9.9%, #1E88E5 83.33%)'
  }
});
