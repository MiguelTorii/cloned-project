// @flow
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Image from "react-graceful-image"
import moment from 'moment'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardActionArea from '@material-ui/core/CardActionArea'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import Chip from '@material-ui/core/Chip'
import grey from '@material-ui/core/colors/grey'
import green from '@material-ui/core/colors/green'
import ShareIcon from '@material-ui/icons/Share'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ReportIcon from '@material-ui/icons/Report'
import DeleteIcon from '@material-ui/icons/Delete'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import CreateIcon from '@material-ui/icons/Create'

import PostComments from 'containers/PostComments'

import TutorBadge from 'components/TutorBadge'
import PdfComponent from 'components/PdfGallery/PdfComponent'
import LinkPreview from 'components/LinkPreview'
import FeedFlashcards from 'components/FeedList/FeedFlashcards'

import * as api from '../../api/posts'

import linkPost from '../../assets/svg/ic_link_post.svg'
import flashcardPost from '../../assets/svg/ic_flashcard_post.svg'
import questionPost from '../../assets/svg/ic_question_post.svg'
import thanksSvg from '../../assets/svg/thanks.svg'
import thankedSvg from '../../assets/svg/thanked.svg'
import commentSvg from '../../assets/svg/comment.svg'

const styles = theme => ({
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
    width: 120,
    height: 120
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
    marginRight: 30,
  },
  flashCards: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 24,
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
  }
})

const FeedItem = ({
  classes,
  data,
  newClassExperience,
  handleShareClick,
  onBookmark,
  onReport,
  onDelete,
  pushTo,
  schoolId,
  onUserClick,
  onPostClick,
  user,
}) => {
  const currentUserId = useMemo(() => user.data.userId, [user.data.userId])
  const [moreAnchorEl, setAnchorEl] = useState(null)
  const [thanksCount, setThanksCount] = useState(0)
  const [thanked, setThanked] = useState(false)
  const isMenuOpen = Boolean(moreAnchorEl)

  const loadData = useCallback(async(typeId) => {
    if (typeId === 3) {
      const currentFlashCard = await api.getFlashcards({ userId: currentUserId, flashcardId: data.postId })
      setThanked(currentFlashCard.thanked)
    }
    if (typeId === 4) {
      const currentNote = await api.getNotes({ userId: currentUserId, noteId: data.postId })
      setThanked(currentNote.thanked)
    }
    if (typeId === 5) {
      const currentSharelink = await api.getShareLink({ userId: currentUserId, sharelinkId: data.postId })
      setThanked(currentSharelink.thanked)
    }
    if (typeId === 6) {
      const currentQuestion = await api.getQuestion({ userId: currentUserId, questionId: data.postId })
      setThanked(currentQuestion.thanked)
    }
  }, [currentUserId, data.postId])

  useEffect(() => {
    setThanksCount(data.postInfo.thanksCount)
  }, [data.postInfo.thanksCount])

  useEffect(() => {
    loadData(data.typeId)
  }, [data.typeId, loadData])

  const handleMenuOpen = useCallback(event => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleShareLinkClick = useCallback(() => {
    const { feedId } = data
    handleShareClick({ feedId })
  }, [data, handleShareClick])

  const handleThanks = useCallback(async () => {
    if (thanked) {
      setThanksCount(thanksCount - 1)
    } else {
      setThanksCount(thanksCount + 1)
    }
    const { postId, typeId } = data
    await api.updateThanks({ userId: currentUserId, postId, typeId })
    await loadData(typeId)
  }, [currentUserId, data, loadData, thanked, thanksCount])

  const handleBookmark = useCallback(() => {
    const { feedId, bookmarked } = data
    handleMenuClose()
    onBookmark({ feedId, bookmarked })
  }, [data, handleMenuClose, onBookmark])

  const handleReport = useCallback(() => {
    const { feedId, userId } = data
    handleMenuClose()
    onReport({ feedId, ownerId: userId })
  }, [data, handleMenuClose, onReport])

  const handleDelete = useCallback(() => {
    const { feedId } = data
    handleMenuClose()
    onDelete({ feedId })
  }, [data, handleMenuClose, onDelete])

  const handleEdit = useCallback(() => {
    const { postId, typeId } = data

    handleMenuClose()
    if (typeId === 3) pushTo(`/edit/flashcards/${postId}`)
    if (typeId === 4) pushTo(`/edit/notes/${postId}`)
    if (typeId === 5) pushTo(`/edit/sharelink/${postId}`)
    if (typeId === 6) pushTo(`/edit/question/${postId}`)
  }, [data, handleMenuClose, pushTo])

  const handleUserClick = useCallback(() => {
    const { userId } = data
    onUserClick({ userId })
  }, [data, onUserClick])

  const handleDescription = useCallback((typeId, body) => {
    if (typeId === 6) return ''

    if (body.length < 100) return body

    return `${body.substring(0, 99)}...`
  }, [])

  const getTitle = useCallback((data: Object): string => {
    return data.title
  }, [])

  const initials = useMemo(() => data.name !== '' ? (data.name.match(/\b(\w)/g) || []).join('') : '', [data.name])
  const date = useMemo(() => moment(data.created), [data.created])
  const fromNow = useMemo(() => date ? date.fromNow() : '', [date])
  const ownerId = useMemo(() => data.userId, [data.userId])

  const description = useMemo(() => handleDescription(data.typeId, data.body), [data.body, data.typeId, handleDescription])

  const renderImage = useCallback(() => {
    const { numberOfNotes } = data
    const isPdf = data.noteUrl.includes('.pdf')
    switch (data.typeId) {
    case 3:
      if (!newClassExperience) {
        return (
          <div className={classes.flashCardsImage}>
            <img
              src={flashcardPost}
              className={classes.flashcardImage}
              alt="Flascarhds"
            />
            <div className={classes.deckCount}>
              {`${data.deck.length} Cards`}
            </div>
          </div>
        )
      }
      return (
        <div className={classes.flashCards}>
          <FeedFlashcards deck={data.deck} />
        </div>
      )
    case 4:
      if (!newClassExperience) {
        return (
          <div className={classes.imageContainer}>
            {
              isPdf ?
                <PdfComponent
                  url={data.noteUrl}
                  height={75}
                  width={75}
                  radius={10}
                /> :
                <Image
                  noLazyLoad
                  className={classes.notePost}
                  src={data.noteUrl}
                />
            }
            {
              numberOfNotes > 1 &&
              <div className={classes.numberOfCardsStyle}>+{numberOfNotes - 1}</div>
            }
          </div>
        )
      }
      return (
        <div className={classes.photoNotes}>
          {
            data.notes.slice(0, 5).map((note, i) => {
              return (
                <div key={note.noteUrl} className={classes.photoNotePreview}>
                  {
                    isPdf ?
                      <PdfComponent
                        url={note.noteUrl}
                        height={100}
                        width={100}
                        radius={10}
                      /> :
                      <Image
                        noLazyLoad
                        className={classes.notePost}
                        src={note.noteUrl}
                      />
                  }
                  {
                    numberOfNotes > 5 && i === 4 &&
                    <div className={classes.numberOfCardsStyle}>
                      +{numberOfNotes - 5}
                    </div>
                  }
                </div>
              )
            })
          }
        </div>
      )
    case 5:
      if (!newClassExperience) {
        return <img src={linkPost} className={classes.imagePost} alt="Link" />
      }
      return <LinkPreview uri={data.uri} />
    case 6:
      return (
        <img
          src={questionPost}
          className={classes.imagePost}
          alt="Question"
        />
      )
    default:
      return null
    }
  }, [classes.deckCount, classes.flashCards, classes.flashCardsImage, classes.flashcardImage, classes.imageContainer, classes.imagePost, classes.notePost, classes.numberOfCardsStyle, classes.photoNotePreview, classes.photoNotes, data, newClassExperience])

  const renderMenu = useMemo(() => (
    <Menu
      disableAutoFocusItem
      anchorEl={moreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleBookmark}>
        <ListItemIcon color="inherit">
          {data.bookmarked ? (
            <BookmarkIcon className={classes.bookmarked} />
          ) : (
            <BookmarkBorderIcon />
          )}
        </ListItemIcon>
        <ListItemText inset primary="Bookmark" />
      </MenuItem>
      {data.userId !== ownerId ? (
        <MenuItem onClick={handleReport}>
          <ListItemIcon color="inherit">
            <ReportIcon />
          </ListItemIcon>
          <ListItemText inset primary="Report" />
        </MenuItem>
      ) : (
        <div>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon color="inherit">
              <CreateIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon color="inherit">
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        </div>
      )}
    </Menu>
  ), [classes.bookmarked, data.bookmarked, data.userId, handleBookmark, handleDelete, handleEdit, handleMenuClose, handleReport, isMenuOpen, moreAnchorEl, ownerId])

  return (
    <div>
      <Card
        className={classes.card}
        elevation={0}
        classes={{ root: classes.root }}
      >
        <CardHeader
          className={classes.header}
          avatar={
            <ButtonBase
              className={classes.avatar}
              onClick={handleUserClick}
            >
              <Avatar aria-label="Recipe" src={data.userProfileUrl}>
                {initials}
              </Avatar>
            </ButtonBase>
          }
          action={
            <>
              <IconButton aria-label="Share" onClick={handleShareLinkClick}>
                <ShareIcon />
              </IconButton>
              {
                newClassExperience &&
                  <IconButton aria-label="Bookmark" onClick={handleBookmark}>
                    {data.bookmarked ? (
                      <BookmarkIcon className={classes.bookmarked} />
                    ) : (
                      <BookmarkBorderIcon />
                    )}
                  </IconButton>
              }
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </>
          }
          title={
            <CardActionArea
              classes={{
                focusHighlight: classes.cardHighlight
              }}
              onClick={handleUserClick}
            >
              <div className={classes.title}>
                <Typography component="div" variant="h6" noWrap>
                  {data.name}
                  {data.role && (
                    <TutorBadge text={data.role} />
                  )}
                </Typography>
              </div>
            </CardActionArea>
          }
          subheader={
            <CardActionArea disabled>
              <div style={{ display: 'flex', alignItems: 'center', color: '#e9ecef' }}>
                <Typography component="p" noWrap>
                  {schoolId === '119' && data.courseDisplayName}
                  {data.classroomName}
                </Typography>
                <Typography
                  component="p"
                  noWrap
                  style={{ marginRight: 5, marginLeft: 5 }}
                >
                  <strong>•</strong>
                </Typography>
                <Typography component="p" noWrap>
                  {fromNow}
                </Typography>
              </div>
            </CardActionArea>
          }
        />
        <CardActionArea
          classes={{
            focusHighlight: classes.cardHighlight
          }}
          onClick={onPostClick({
            typeId: data.typeId,
            postId: data.postId,
            feedId: data.feedId
          })}
        >
          <CardContent className={classes.postTitle}>
            <Typography component="p" variant="h5">
              {!newClassExperience ? data.title : getTitle(data)}
            </Typography>
          </CardContent>
          <CardContent className={classes.content}>
            <Typography className={classes.description} component="p" variant="body2">
              {description}
            </Typography>
            <span />
            {renderImage()}
          </CardContent>
          <CardContent className={classes.tags}>
            {data.tags.map(tag => (
              !newClassExperience ?
                <Chip
                  key={tag.id}
                  label={`#${tag.name}`}
                  className={classes.chip}
                  classes={{ label: classes.label }}
                /> :
                <span key={tag.id} className={classes.hashtag}>{`#${tag.name}`}</span>
            ))}
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.actions} disableactionspacing='true'>
          <div className={classes.stats}>
            <Typography
              component="p"
              variant="subtitle1"
              className={cx(classes.actionIcons, thanked && classes.thankedMark)}
            >
              <IconButton
                aria-label="Share"
                disabled={currentUserId === ownerId}
                onClick={handleThanks}
              >
                {thanked
                  ? <img
                    src={thankedSvg}
                    className={classes.actionIcon}
                    alt="thanked"
                  />
                  :<img
                    src={thanksSvg}
                    className={classes.actionIcon}
                    alt="thanks"
                  />}
              </IconButton>
              <strong>{thanksCount}</strong>
            </Typography>
            <Typography
              component="p"
              variant="subtitle1"
              className={classes.actionIcons}
            >
              <img
                src={commentSvg}
                className={classes.actionIcon}
                alt="comment"
              />
              <strong>{data.postInfo.questionsCount}</strong>
            </Typography>
          </div>
          <Typography
            component="p"
            variant="subtitle1"
            className={!newClassExperience ? classes.stat : classes.stat2}
          >
            <strong>{data.postInfo.viewCount}</strong> &nbsp; views
          </Typography>
        </CardActions>
        {renderMenu}

        <PostComments
          feedId={data.feedId}
          postId={data.postId}
          typeId={data.typeId}
        />
      </Card>
    </div>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
})

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(FeedItem))
