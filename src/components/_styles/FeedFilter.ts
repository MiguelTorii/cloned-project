import { gutterStyle } from './Gutter';
export default (theme) => ({
  root: {
    ...gutterStyle(theme),
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    margin: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.circleIn.palette.feedBackground
  },
  dialog: {
    backgroundColor: theme.circleIn.palette.appBar,
    width: 600
  },
  filterDescription: {
    margin: theme.spacing(0, 0, 2, 0),
    fontSize: 20,
    color: 'white !important'
  },
  description: {
    margin: theme.spacing(0, 0, 2, 3.5)
  },
  icon: {
    borderRadius: 3,
    width: 20,
    height: 20,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    '&:before': {
      display: 'block',
      width: 20,
      height: 20,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
    }
  },
  searchButton: {
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    color: 'black',
    minWidth: 150,
    borderRadius: theme.spacing(3),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    fontWeight: 400
  },
  closeSearchModalButton: {
    color: 'white'
  },
  filtersHeader: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filtersFooter: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  input: {
    marginRight: 8,
    flex: 1,
    borderRadius: 4,
    paddingLeft: 8,
    backgroundColor: theme.circleIn.palette.primaryBackground
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  option: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  formControl: {
    margin: theme.spacing(2)
  },
  formButton: {
    marginLeft: theme.spacing(),
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing()
  },
  actions: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  grow: {
    flex: 1
  },
  filterButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    '& span': {
      height: 24.5,
      overflow: 'hidden',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      display: 'block'
    }
  },
  filterButtonContainer: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  searchIcon: {
    opacity: 0.3
  },
  filterTypeBadge: {
    width: 110,
    color: 'white',
    fontWeight: 500,
    borderRadius: theme.spacing(),
    margin: theme.spacing(4 / 8, 1, 4 / 8, 0)
  },
  deleteFilterIcon: {
    color: 'white'
  }
});
