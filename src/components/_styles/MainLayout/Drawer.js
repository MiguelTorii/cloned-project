import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  backHeader: {
    margin: theme.spacing(2)
  },
  drawerList: {
    overflow: 'auto !important',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  backTitle: {
    width: '100%',
    fontSize: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  newItem: {
    width: 'auto',
    margin: theme.spacing(),
    padding: 0,
    paddingLeft: theme.spacing(3),
    borderRadius: theme.spacing(),
    marginTop: theme.spacing(2)
  },
  newRoot: {
    flex: 'inherit'
  },
  newLabel: {
    color: theme.circleIn.palette.primaryText1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  currentPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    background: theme.circleIn.palette.hoverMenu,
    '& span': {
      fontWeight: 'bold',
    },
    paddingTop: 0,
    paddingBottom: 0,
    margin: theme.spacing(1, 2),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  otherPath: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  otherBlue: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    color: theme.circleIn.palette.brand,
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  separator: {
    marginTop: 'auto',
  },
  verticalSpacing: {
    margin: theme.spacing(2, 0, 1, 0)
  },
  iconColorBrand: {
    color: theme.circleIn.palette.brand
  },
  lastItem: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    margin: theme.spacing(1, 2),
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  newIconContainer: {
    padding: theme.spacing(3/2),
    borderRadius: '50%',
    marginRight: theme.spacing(),
    backgroundImage: `linear-gradient(to top, #94daf9, ${theme.circleIn.palette.primaryii222})`
  },
  newIcon: {
    color: 'black',
    fontWeight: 'bold'
  },
  bulb: {
    transform: 'rotate(180deg)'
  },
  expertContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2)
  },
  expertToggle: {
    cursor: 'pointer',
    height: 35,
    width: 50
  },
  expertTitle: {
    fontWeight: 'bold'
  },
  pr1: {
    paddingRight: theme.spacing(0.6)
  },
  item: {
    width: 'auto',
    borderRadius: theme.spacing(6),
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(3),
    '&:hover': {
      background: theme.circleIn.palette.hoverMenu
    },
  },
  flashcardsIcon: {
    width: 24,
    height: 24
  },
  flashcardIconOn: {
    objectFit: 'scale-down',
    maxHeight: 32,
    maxWidth: 28
  },
  divider: {
    margin: theme.spacing(2, 2, 1, 2),
    border: '1px solid #C5C5C6'
  },
  avatar: {
    marginRight: theme.spacing()
  }
}));