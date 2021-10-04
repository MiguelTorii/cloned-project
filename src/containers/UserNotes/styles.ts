import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(theme => ({
  listItemContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: theme.circleIn.palette.gray1
    }
  },
  listItem: {
    borderBottom: `1px solid #5F61654D`,
    fontWeight: 800,
    fontSize: 24,
    color: theme.circleIn.palette.primaryText1,
    lineHeight: '33px',
    paddingLeft: 0,
    marginLeft: theme.spacing(1)
  },
  listRoot: {
    padding: 0
  },
  title: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1)
  },
  emptyStateContainer: {
    maxWidth: 514,
    lineHeight: '33px',
    textAlign: 'left'
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: theme.circleIn.palette.white,
    marginBottom: theme.spacing(3)
  },
  emptyBody: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.circleIn.palette.white
  },
  noteListRoot: {
    padding: 0,
    paddingLeft: theme.spacing(4)
  },
  emptyFolder: {
    color: '#84868A',
    fontSize: 16,
    lineHeight: '22px',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  createNote: {
    color: theme.circleIn.palette.white,
    fontSize: 18,
    lineHeight: '25px',
    margin: theme.spacing(1.5, 0, 3, -3)
  },
  addNote: {
    color: theme.circleIn.palette.brand
  }
}));