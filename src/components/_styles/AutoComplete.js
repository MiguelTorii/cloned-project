import { emphasize } from '@material-ui/core/styles/colorManipulator';

export const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: theme.spacing(1, 0)
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: `${theme.spacing(1/2)}px ${theme.spacing(1/4)}px`,
    maxWidth: 160,
    backgroundColor: theme.palette.primary.main
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing()}px ${theme.spacing(2)}px`
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
  paperAbsolute: {
    position: 'absolute',
  },
  paperRelative: {
    position: 'relatve',
  },
  errorLabel: {
    paddingLeft: 12
  }
})
