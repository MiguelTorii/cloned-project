import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  usersContainer: {
    width: '100%',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.circleIn.palette.modalBackground}`,
  },
  listRoot: {
    width: '100%',
    overflow: 'auto',
  },
  secondaryAction: {
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.circleIn.palette.modalBackground,
    minHeight: 59,
    padding: theme.spacing(),
  },
  headerTitle: {
    fontSize: 18,
  },
  title: {
    width: 'inherit',
    textAlign: 'center',
    fontSize: 20,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  infoContainer: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(2),
  },
  usersTitle: {
    padding: 0,
    fontWeight: 'bold',
  },
  usersCount: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    paddingRight: theme.spacing()
  },
  icon: {
    cursor: 'pointer',
    fontSize: 14
  },
  avatar: {
    margin: theme.spacing(2),
    height: theme.spacing(10),
    width: theme.spacing(10),
    fontSize: 30
  },
  membersExpansion: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  membersSummary: {
    margin: 0,
    padding: 0
  },
  membersDetails: {
    padding: 0
  },
  membersExpanded: {
    margin: '0 !important',
    minHeight: '0 !important',
  },
  expandIcon: {
    padding: 0,
    marginRight: 0,
    '& .MuiSvgIcon-root': {
      fontSize: 18
    },
  },
  expandedRotate: {
    margin: '0 !important',
    minHeight: '0 !important',
    '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
      transform: 'rotate(90deg)'
    }
  },
  searchPaperRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.circleIn.palette.feedBackground,
    width: 400,
    borderRadius: 20
  },
  iconButton: {
    padding: theme.spacing(1, 0, 1, 3)
  },
  search: {
    marginLeft: theme.spacing(),
    flex: 1
  },
}))

export default useStyles