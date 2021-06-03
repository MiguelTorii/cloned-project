import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

export const styles = theme => ({
  root: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: grey[600],
    borderBottomStyle: 'solid',
    backgroundColor: theme.circleIn.palette.feedBackground,
    marginTop: theme.spacing(3)
  },
  media: {
    height: 10
  },
  header: {
    padding: theme.spacing()
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    '& > :first-child': {
      fontWeight: 800,
      marginRight: theme.spacing(1/2)
    },
    '& > :last-child': {
      marginLeft: theme.spacing(1/2)
    }
  },
  description: {
    wordBreak: 'break-word',
    marginBottom: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    '& > :nth-child(2)': {
      flex: 1
    }
  },
  postTitle: {
    paddingLeft: theme.spacing()
  },
  cardHighlight: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  actions: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0
  },
  stats: {
    display: 'flex',
    margin: theme.spacing(),
  },
  stat: {
    color: theme.palette.primary.primaryColor,
    margin: theme.spacing(),
  },
  stat2: {
    color: theme.palette.primary.primaryColor,
    margin: theme.spacing(),
  },
  actionIcons: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.primaryColor,
    marginRight: theme.spacing(3),
  },
  actionIcon: {
    fontSize: 16,
    marginRight: theme.spacing(1)
  },
  thankedMark: {
    color: theme.circleIn.palette.brand
  },
  rank: {
    width: 15
  },
  notePost: {
    objectFit: 'cover',
    borderRadius: 10,
    width: 295,
    height: 169
  },
  noteTitleBox: {
    position: 'absolute',
    backgroundColor: theme.circleIn.palette.appBar,
    left: 0,
    right: 0,
    bottom: 0,
    padding: theme.spacing(2),
    fontSize: 16,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    borderRadius: '0 0 8px 8px'
  },
  feedSubheader: {
    padding: theme.spacing(0, 0.5),
    color: theme.circleIn.palette.profilebgColor
  },
  imageContainer: {
    position: 'relative',
  },
  numberOfCardsStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    height: 120,
    width: 122,
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    top: 0,
  },
  imagePost: {
    minHeight: 75,
    maxHeight: 75,
    minWidth: 75,
    maxWidth: 75
  },
  flashcardImage: {
    width: 75
  },
  flashCardsImage: {
    display: 'flex',
    flexDirection: 'column'
  },
  deckCount: {
    width: 75,
    background: '#345952',
    textAlign: 'center',
    color: 'white',
    padding: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%'
  },
  tags: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing(),
  },
  hashtag: {
    color: theme.palette.primary.main,
    fontSize: 14,
    marginRight: 5,
  },
  label: {
    fontSize: 10
  },
  bookmarked: {
    color: green[500]
  },
  photoNotes: {
    display: 'flex',
    marginTop: 20,
    position: 'relative',
  },
  photoNotePreview: {
    position: 'relative',
    marginRight: 30,
  },
  flashCards: {
    width: 270,
    height: 130,
    backgroundColor: theme.circleIn.palette.appBar,
    borderRadius: 10
  },
  gradientBar: {
    width: '100%',
    height: 12,
    background: 'linear-gradient(115.22deg, #94DAF9 -9.12%, #1E88E5 90.34%)',
    borderRadius: '10px 10px 0 0'
  },
  flashcardTitle: {
    fontWeight: 700,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  flashcardCount: {
    color: theme.circleIn.palette.primaryText2
  },
  editor: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 2, 1),
    '& .ql-toolbar.ql-snow': {
      border: 'none'
    },
    '& .ql-editor': {
      background: theme.circleIn.palette.hoverMenu,
      color: theme.palette.common.white,
      borderRadius: 100,
    }
  },
  innerContainerEditor: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
    '& .quill': {
      flex: 1,
      '& .ql-container.ql-snow': {
        border: 'none'
      }
    }
  },
  editorToolbar: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0
  },
  postComment: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 50,
    marginLeft: theme.spacing(),
    backgroundImage: `linear-gradient(107.98deg, #5dc8fd -09.19%, #0074b5 122.45%)`
  },
  postCommentAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  postCommentIcon: {
    fontSize: 16,
    marginLeft: theme.spacing(0.5)
  },
  nonError: {
    display: 'none'
  },
  error: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1, 2, 1),
  },
  errorMessage: {
    fontSize: 12,
    color: theme.circleIn.palette.danger
  },
  titleText: {
    fontSize: 18
  },
  markdown: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  }
})
