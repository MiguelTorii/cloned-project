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
import pluralize from 'pluralize';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import * as api from '../../api/posts'

import linkPost from '../../assets/svg/ic_link_post.svg'
import flashcardPost from '../../assets/svg/ic_flashcard_post.svg'
import thanksSvg from '../../assets/svg/thanks.svg'
import thankedSvg from '../../assets/svg/thanked.svg'
import commentSvg from '../../assets/svg/comment.svg'
import FeedIconFlashcards from '../../assets/svg/flashcards_new.svg';
import FeedIconResource from '../../assets/svg/links.svg';
import FeedIconQuestion from '../../assets/svg/questions.svg';
import FeedIconNote from '../../assets/svg/notes_new.svg';
import FeedIconPost from '../../assets/svg/posts.svg';

import styles from '../_styles/FeedList/FeedItem';
import OnlineBadge from '../OnlineBadge';
import { getInitials } from 'utils/chat'

const FeedTypes = {
  flashcards: {
    id: 3,
    url: FeedIconFlashcards,
    title: 'Flashcards',
    text_by: 'Created by'
  },
  note: {
    id: 4,
    url: FeedIconNote,
    title: 'Notes',
    text_by: 'Shared by'
  },
  resource: {
    id: 5,
    url: FeedIconResource,
    title: 'Resource',
    text_by: 'Shared by'
  },
  question: {
    id: 6,
    url: FeedIconQuestion,
    title: 'Question',
    text_by: 'Asked by'
  },
  post: {
    id: 8,
    url: FeedIconPost,
    title: 'Post',
    text_by: 'Posted by'
  }
};

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
  toolbarPrefix
}) => {
  const currentUserId = useMemo(() => user.data.userId, [user.data.userId])
  const [moreAnchorEl, setAnchorEl] = useState(null)
  const [thanksCount, setThanksCount] = useState(0)
  const [thanked, setThanked] = useState(false)
  const isMenuOpen = Boolean(moreAnchorEl)

  useEffect(() => {
    setThanked(data.thanked);
    setThanksCount(data.postInfo.thanksCount);
  }, [data, setThanked]);

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
    const { postId, typeId } = data
    await api.updateThanks({ userId: currentUserId, postId, typeId })
    if (thanked) {
      setThanksCount(thanksCount - 1)
    } else {
      setThanksCount(thanksCount + 1)
    }

    setThanked(!thanked);
  }, [currentUserId, data, thanked, thanksCount])

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
    if (typeId === 8) pushTo(`/edit/post/${postId}`)
  }, [data, handleMenuClose, pushTo])

  const handleUserClick = useCallback(() => {
    const { userId } = data
    onUserClick({ userId })
  }, [data, onUserClick])

  const handleDescription = useCallback((typeId, body) => {
    if (typeId === 6) return ''

    const cleanBody = body.replace(/<[^>]*>/g, '')

    if (cleanBody.length < 100) return cleanBody

    return `${cleanBody.substring(0, 600)}...`
  }, [])

  const getTitle = useCallback((data: Object): string => {
    return data.title
  }, [])

  const initials = useMemo(() => getInitials(data.name), [data.name])
  const date = useMemo(() => moment(data.created), [data.created])
  const fromNow = useMemo(() => date ? date.fromNow() : '', [date])
  const ownerId = useMemo(() => data.userId, [data.userId])

  const description = useMemo(() => handleDescription(data.typeId, data.body), [data.body, data.typeId, handleDescription])
  const feedTypeData = useMemo(() => {
    const type = Object.values(FeedTypes).find((item) => item.id === data.typeId);
    if (!type) {
      throw new Error('Unknown Feed Type');
    }
    return type;
  }, [data.typeId]);

  const renderImage = useCallback(() => {
    const { numberOfNotes } = data
    const isPdf = data.noteUrl.includes('.pdf')
    switch (data.typeId) {
    case FeedTypes.flashcards.id:
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
        <Box mt={3}>
          <Box className={classes.flashCards}>
            <Box className={classes.gradientBar} />
            <Box mt={3} pl={1} pr={1}>
              <Typography variant="h6" className={classes.flashcardTitle}>
                {data.title}
              </Typography>
              <Typography className={classes.flashcardCount}>
                {pluralize('flashcard', data.deck.length, true)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    case FeedTypes.note.id:
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
            data.notes.slice(0, 1).map((note, i) => {
              return (
                <div key={note.noteUrl} className={classes.photoNotePreview}>
                  {
                    isPdf ?
                      <PdfComponent
                        url={note.noteUrl}
                        height={130}
                        width={270}
                        radius={10}
                      /> :
                      <Image
                        noLazyLoad
                        className={classes.notePost}
                        src={note.noteUrl}
                      />
                  }
                  <div className={classes.noteTitleBox}>
                    { data.title }
                  </div>
                  {
                    numberOfNotes > 2 && i === 1 &&
                    <div className={classes.numberOfCardsStyle}>
                      +{numberOfNotes - 2}
                    </div>
                  }
                </div>
              )
            })
          }
        </div>
      )
    case FeedTypes.resource.id:
      if (!newClassExperience) {
        return <img src={linkPost} className={classes.imagePost} alt="Link" />
      }
      return <LinkPreview uri={data.uri} />
    default:
      return null
    }
  }, [classes, data, newClassExperience])

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
      {data.userId !== currentUserId ? (
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
  ), [classes.bookmarked, currentUserId, data.bookmarked, data.userId, handleBookmark, handleDelete, handleEdit, handleMenuClose, handleReport, isMenuOpen, moreAnchorEl])

  return (
    <Card
      className={classes.card}
      elevation={0}
      classes={{ root: classes.root }}
    >
      <CardHeader
        className={classes.header}
        avatar={
          <Avatar src={feedTypeData.url} />
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
          <div className={classes.title}>
            <Typography component="div" variant="h6" noWrap>
              {feedTypeData.title}
            </Typography>
          </div>
        }
        subheader={
          <Typography className={classes.feedSubheader}>
            {data.classroomName}
          </Typography>
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
          <Typography component="p" variant="h5" className={classes.boldTitle}>
            {!newClassExperience ? data.title : getTitle(data)}
          </Typography>
        </CardContent>
        {(data.typeId !== FeedTypes.question.id) && (
          <CardContent className={classes.content}>
            <div className={
              data.title === 0
                ? classes.titleFormat
                : classes.markdown
            }>
              {description}
            </div>
            <span />
            {renderImage()}
          </CardContent>
        )}
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
      <CardActions>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography variant="h6" className={classes.titleText}>
              {feedTypeData.text_by}
            </Typography>
          </Grid>
          <Grid item>
            <ButtonBase
              className={classes.avatar}
              onClick={handleUserClick}
            >
              <OnlineBadge isOnline={data.isOnline} bgColorPath="circleIn.palette.feedBackground" fromChat>
                <Avatar aria-label="Recipe" src={data.userProfileUrl}>
                  {initials}
                </Avatar>
              </OnlineBadge>
            </ButtonBase>
          </Grid>
          <Grid item>
            <CardActionArea
              classes={{
                focusHighlight: classes.cardHighlight
              }}
              onClick={handleUserClick}
            >
              <Typography className={classes.titleText} component="div" variant="h6" noWrap>
                {data.name}
                {data.role && (
                  <TutorBadge text={data.role} />
                )}
              </Typography>
            </CardActionArea>
          </Grid>
          <Grid item>
            <Box ml={2}>
              <Typography component="p" noWrap>
                {fromNow}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardActions>
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

      <Box mt={-5}>
        <PostComments
          feedId={data.feedId}
          postId={data.postId}
          typeId={data.typeId}
          toolbarPrefix={toolbarPrefix}
          isQuestion={data.typeId === FeedTypes.question.id}
          isOwner={data.userId === currentUserId}
          hasBestAnswer={data.bestAnswer}
        />
      </Box>
    </Card>
  )
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
})

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(FeedItem))
