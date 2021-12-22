import { emphasize } from '@material-ui/core/styles/colorManipulator';

export default (theme: any): any => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: theme.spacing(1, 0)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addClassmateInput: {
    position: 'relative',
    display: 'flex',
    padding: theme.spacing(1 / 8)
  },
  startIcon: {
    marginLeft: theme.spacing()
  },
  searchInput: {
    border: '1px solid rgba(95, 97, 101, 0.5)',
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(34, 34, 34, 0.6)'
  },
  floatChatSearchInput: {
    borderBottom: '1px solid #323536',
    backgroundColor: 'rgba(34, 34, 34, 0.6)',
    padding: theme.spacing()
  },
  startInputText: {
    color: '#828282',
    fontWeight: 700
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  addClassmateChip: {
    margin: `${theme.spacing(1 / 4)}px ${theme.spacing(1 / 4)}px`,
    borderRadius: 0,
    maxWidth: 160,
    backgroundColor: theme.circleIn.palette.appBar,
    color: 'white'
  },
  chip: {
    margin: `${theme.spacing(1 / 2)}px ${theme.spacing(1 / 4)}px`,
    maxWidth: 160,
    backgroundColor: theme.palette.primary.main
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`
  },
  addClassmatePlaceholder: {
    position: 'absolute',
    left: 4,
    fontSize: 16,
    opacity: 0.7
  },
  floatChatInputPlaceholder: {
    color: '#5F6165',
    position: 'absolute',
    left: 4,
    fontSize: 16,
    opacity: 0.7
  },
  placeholder: {
    position: 'absolute',
    left: 12,
    fontSize: 12,
    opacity: 0.7
  },
  paper: {
    zIndex: 100,
    marginTop: theme.spacing(),
    left: 0,
    right: 0
  },
  schoolSearchMenu: {
    backgroundColor: theme.circleIn.palette.feedBackground,
    opacity: 0.85
  },
  addClassmatePaper: {
    zIndex: 100,
    left: 0,
    right: 0,
    boxShadow: 'none',
    border: 'none',
    '& > :first-child': {
      padding: 0,
      backgroundColor: theme.circleIn.palette.appBar,
      width: '100%'
    }
  },
  paperAbsolute: {
    position: 'absolute'
  },
  paperRelative: {
    position: 'relatve'
  },
  errorLabel: {
    paddingLeft: 12
  },
  createDM: {
    marginTop: theme.spacing(),
    width: '100%',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: 20
  },
  schoolSearchPlaceholder: {
    color: theme.circleIn.palette.primaryText2,
    fontSize: 18
  },
  schoolSearchTextField: {
    borderRadius: 10,
    border: 'solid 1px rgba(0, 0, 0, 0.5)',
    background: 'white',
    '& > div:before, & > div:after': {
      borderBottom: 'none !important'
    }
  },
  schoolSearchInput: {
    color: theme.circleIn.palette.primaryBackground,
    fontSize: 20
  },
  schoolSearchValue: {
    '& > p': {
      fontSize: 20,
      color: theme.circleIn.palette.primaryBackground
    }
  }
});
