/* eslint-disable jsx-a11y/accessible-emoji */

/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { connect, useDispatch, useSelector } from 'react-redux';
import Image from 'react-graceful-image';
import moment from 'moment';
import pluralize from 'pluralize';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import MuiAvatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CreateIcon from '@material-ui/icons/Create';
import { push } from 'connected-react-router';

import Avatar from 'components/Avatar';
import ViewNotes from '../../containers/PostComments/ViewNotes';
import RoleBadge from '../RoleBadge/RoleBadge';
import PdfComponent from '../PdfGallery/PdfComponent';
import LinkPreview from '../LinkPreview/LinkPreview';
import * as api from '../../api/posts';
import linkPost from '../../assets/svg/ic_link_post.svg';
import flashcardPost from '../../assets/svg/ic_flashcard_post.svg';
import thanksSvg from '../../assets/svg/thanks.svg';
import thankedSvg from '../../assets/svg/thanked.svg';
import commentSvg from '../../assets/svg/comment.svg';
import FeedIconFlashcards from '../../assets/svg/flashcard-mark.svg';
import FeedIconResource from '../../assets/svg/ic_share_a_resource.svg';
import FeedIconQuestion from '../../assets/svg/ic_ask_a_question.svg';
import FeedIconNote from '../../assets/svg/ic_notes.svg';
import FeedIconPost from '../../assets/svg/ic_create_a_post.svg';
import { getPastClassIds } from '../../utils/helpers';
import HoverPopup from '../HoverPopup/HoverPopup';
import { ANONYMOUS_USER_ID, PROFILE_PAGE_SOURCE } from 'constants/common';
import type { State as StoreState } from '../../types/state';
import { TFeedItem } from '../../types/models';
import { POST_TYPES } from 'constants/app';
import CustomQuill from 'components/CustomQuill/CustomQuill';

import useStyles from 'components/_styles/FeedList/FeedItem';
import { Button } from '@material-ui/core';

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

type Props = {
  data?: TFeedItem;
  newClassExperience?: any;
  handleShareClick?: any;
  onBookmark?: any;
  onReport?: any;
  onDelete?: any;
  pushTo?: any;
  onUserClick?: any;
  onPostClick?: any;
  user?: any;
  toolbarPrefix?: any;
  showComments?: any;
  showSimple?: any; // This prop is to show a simple post or not. Simple post is like in recommendations
  expertMode?: any;
  userId?: any;
  schoolId?: any;
  innerRef?: any;
  setQuillRefs?: any;
  quillRefs?: any;
  setNewComments?: any;
  newComments?: any;
  postId?: number;
  typeId?: number;
};

const FeedItem = ({
  data,
  newClassExperience,
  handleShareClick,
  onBookmark,
  onReport,
  onDelete,
  pushTo,
  onUserClick,
  onPostClick,
  user,
  toolbarPrefix,
  showComments,
  showSimple, // This prop is to show a simple post or not. Simple post is like in recommendations
  expertMode,
  userId,
  schoolId,
  innerRef,
  setQuillRefs,
  quillRefs,
  setNewComments,
  newComments,
  postId,
  typeId
}: Props) => {
  const classes: any = useStyles({
    showSimple
  });
  const dispatch = useDispatch();
  const currentUserId = useMemo(() => user.data.userId, [user.data.userId]);
  const [moreAnchorEl, setAnchorEl] = useState(null);
  const [thanksCount, setThanksCount] = useState(0);
  const [thanked, setThanked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const classList = useSelector((state) => (state as any).user.userClasses.classList);
  const isCurrent = useMemo(() => {
    const postClass = classList.find((classData) => classData.classId === data.classId);

    if (!postClass) {
      return false;
    }

    return !!postClass.isCurrent;
  }, [data, classList]);
  const isMenuOpen = Boolean(moreAnchorEl);
  const pastClassIds = useMemo(() => getPastClassIds(classList), [classList]);
  useEffect(() => {
    setThanked(data.thanked);
    setThanksCount(data.postInfo.thanksCount);
    setCommentCount(data.postInfo.questionsCount);
  }, [data, setThanked]);
  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleShareLinkClick = useCallback(() => {
    const { feedId } = data;
    handleShareClick({
      feedId
    });
  }, [data, handleShareClick]);
  const handleThanks = useCallback(async () => {
    const { postId, typeId } = data;
    await api.updateThanks({
      userId: currentUserId,
      postId,
      typeId
    });

    if (thanked) {
      setThanksCount(thanksCount - 1);
    } else {
      setThanksCount(thanksCount + 1);
    }

    setThanked(!thanked);
  }, [currentUserId, data, thanked, thanksCount]);
  const handleBookmark = useCallback(() => {
    const { feedId, bookmarked } = data;
    handleMenuClose();
    onBookmark({
      feedId,
      bookmarked
    });
  }, [data, handleMenuClose, onBookmark]);
  const handleReport = useCallback(() => {
    const { feedId, userId, name } = data;
    handleMenuClose();
    onReport({
      feedId,
      ownerId: userId,
      ownerName: name
    });
  }, [data, handleMenuClose, onReport]);
  const handleDelete = useCallback(() => {
    const { feedId } = data;
    handleMenuClose();
    onDelete({
      feedId
    });
  }, [data, handleMenuClose, onDelete]);
  const handleEdit = useCallback(() => {
    const { postId, typeId } = data;
    handleMenuClose();

    switch (typeId) {
      case POST_TYPES.FLASHCARDS:
        dispatch(push(`/edit/flashcards/${postId}`));
        break;
      case POST_TYPES.NOTE:
        dispatch(push(`/edit/notes/${postId}`));
        break;
      case POST_TYPES.LINK:
        dispatch(push(`/edit/sharelink/${postId}`));
        break;
      case POST_TYPES.QUESTION:
        dispatch(push(`/edit/question/${postId}`));
        break;
      case POST_TYPES.POST:
        dispatch(push(`/edit/post/${postId}`));
        break;
      default:
        break;
    }
  }, [data, handleMenuClose, pushTo]);
  const handleUserClick = useCallback(() => {
    const { userId } = data;

    if (Number(data.userId) === ANONYMOUS_USER_ID) {
      return;
    }

    onUserClick({
      userId
    });
  }, [data, onUserClick]);
  const handleAddComment = useCallback(() => setCommentCount(commentCount + 1), [commentCount]);
  const handleDeleteComment = useCallback(() => setCommentCount(commentCount - 1), [commentCount]);
  const handleCollapse = useCallback(() => setCollapsed(!collapsed), [collapsed]);
  const getTitle = useCallback((data: Record<string, any>): string => data.title, []);
  const date = useMemo(() => moment(data.created), [data.created]);
  const fromNow = useMemo(() => (date ? date.fromNow() : ''), [date]);
  const ownerId = useMemo(() => data.userId, [data.userId]);
  const feedTypeData = useMemo(() => {
    const type = Object.values(FeedTypes).find((item) => item.id === data.typeId);

    if (!type) {
      throw new Error('Unknown Feed Type');
    }

    return type;
  }, [data.typeId]);

  const handleClick = () => {
    onPostClick({
      typeId: data.typeId,
      postId: data.postId,
      feedId: data.feedId
    });
  };

  const renderImage = useCallback(() => {
    const { numberOfNotes } = data;
    const isPdf = data.noteUrl.includes('.pdf');

    switch (data.typeId) {
      case FeedTypes.flashcards.id:
        if (!newClassExperience) {
          return (
            <div className={classes.flashCardsImage}>
              <img src={flashcardPost} className={classes.flashcardImage} alt="Flascarhds" />
              <div className={classes.deckCount}>{`${data.deck.length} Cards`}</div>
            </div>
          );
        }

        return (
          <Box mt={3}>
            <Box className={classes.flashCards}>
              <Box className={classes.gradientBar} />
              <Box mt={showSimple ? 2 : 3} pl={1} pr={1}>
                {!showSimple && (
                  <Typography variant="h6" className={classes.flashcardTitle}>
                    {data.title}
                  </Typography>
                )}
                <Typography
                  className={classes.flashcardCount}
                  align={showSimple ? 'left' : 'center'}
                >
                  {pluralize(showSimple ? 'card' : 'flashcard', data.deck.length, true)}
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case FeedTypes.note.id:
        if (!newClassExperience) {
          return (
            <div className={classes.imageContainer}>
              {isPdf ? (
                <PdfComponent url={data.noteUrl} height={75} width={75} radius={10} />
              ) : (
                <Image noLazyLoad className={classes.notePost} src={data.noteUrl} />
              )}
              {numberOfNotes > 1 && (
                <div className={classes.numberOfCardsStyle}>+{numberOfNotes - 1}</div>
              )}
            </div>
          );
        }

        return (
          <div className={classes.photoNotes}>
            {data.notes.slice(0, 1).map((note, i) => (
              <div key={note.noteUrl} className={classes.photoNotePreview}>
                {isPdf ? (
                  <PdfComponent url={note.noteUrl} height={130} width={270} radius={10} />
                ) : (
                  <Image noLazyLoad className={classes.notePost} src={note.noteUrl} />
                )}
                <div className={classes.noteTitleBox}>{data.title}</div>
                {numberOfNotes > 2 && i === 1 && (
                  <div className={classes.numberOfCardsStyle}>+{numberOfNotes - 2}</div>
                )}
              </div>
            ))}
          </div>
        );

      case FeedTypes.resource.id:
        if (!newClassExperience) {
          return <img src={linkPost} className={classes.imagePost} alt="Link" />;
        }

        return <LinkPreview uri={data.uri} />;

      default:
        return null;
    }
  }, [classes, data, newClassExperience, showSimple]);

  const renderMenu = useMemo(
    () => (
      <Menu
        disableAutoFocusItem
        anchorEl={moreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        getContentAnchorEl={null}
      >
        {data.userId !== currentUserId ? (
          <MenuItem onClick={handleReport}>
            <ListItemIcon color="inherit">
              <FlagIcon />
            </ListItemIcon>
            <ListItemText inset primary="Report an Issue" />
          </MenuItem>
        ) : (
          isCurrent && (
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
          )
        )}
      </Menu>
    ),
    [
      currentUserId,
      data.userId,
      handleDelete,
      handleEdit,
      handleMenuClose,
      handleReport,
      isMenuOpen,
      moreAnchorEl,
      isCurrent
    ]
  );

  return (
    <Card
      className={classes.card}
      elevation={0}
      classes={{
        root: classes.root
      }}
    >
      <CardHeader
        className={classes.header}
        avatar={<MuiAvatar src={feedTypeData.url} />}
        action={
          <>
            <IconButton aria-label="Share" onClick={handleShareLinkClick}>
              <ShareIcon />
            </IconButton>
            {newClassExperience && (
              <IconButton aria-label="Bookmark" onClick={handleBookmark}>
                {data.bookmarked ? (
                  <BookmarkIcon className={classes.bookmarked} />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            )}
            {(data.userId !== currentUserId || isCurrent) && (
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            )}
          </>
        }
        title={
          <div className={classes.title}>
            <Typography component="div" variant={showSimple ? 'body1' : 'h6'} noWrap>
              {feedTypeData.title}
            </Typography>
          </div>
        }
        subheader={
          <Typography
            className={classes.feedSubheader}
            variant={showSimple ? 'subtitle1' : 'body1'}
          >
            {data.classroomName}
          </Typography>
        }
      />
      <CardActionArea
        classes={{
          focusHighlight: classes.cardHighlight
        }}
        onClick={handleClick}
      >
        <CardContent className={classes.postTitle}>
          <Typography component="p" variant="h5" className={classes.boldTitle}>
            {!newClassExperience ? data.title : getTitle(data)}
          </Typography>
        </CardContent>
        {data.typeId !== FeedTypes.question.id && (
          <CardContent className={classes.content}>
            <div style={{ maxHeight: collapsed ? 100 : 'none' }} className={classes.feedBody}>
              <CustomQuill value={data.body} readOnly />
            </div>
            {collapsed && data?.body.length > 200 && (
              <Button onClick={handleCollapse}>Read More</Button>
            )}
            <span />
            <div>{renderImage()}</div>
          </CardContent>
        )}
        {data.tags.length > 0 && (
          <CardContent className={classes.tags}>
            {data.tags.map((tag) =>
              !newClassExperience ? (
                <Chip
                  key={tag.id}
                  label={`#${tag.name}`}
                  className={classes.chip}
                  classes={{
                    label: classes.label
                  }}
                />
              ) : (
                <span key={tag.id} className={classes.hashtag}>{`#${tag.name}`}</span>
              )
            )}
          </CardContent>
        )}
      </CardActionArea>
      <CardActions>
        <Grid container spacing={1} alignItems="center">
          {!showSimple && (
            <Grid item>
              <Typography variant="h6" className={classes.titleText}>
                {feedTypeData.text_by}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <HoverPopup userId={data.userId} profileSource={PROFILE_PAGE_SOURCE.POST}>
              <Box display="flex" alignItems="center">
                <Avatar
                  profileImage={data.userProfileUrl}
                  fullName={data.name}
                  isOnline={data.isOnline}
                  fromChat
                  onlineBadgeBackground={'circleIn.palette.feedBackground'}
                  handleUserClick={handleUserClick}
                />
                <Box marginLeft={1}>
                  <CardActionArea
                    classes={{
                      focusHighlight: classes.cardHighlight
                    }}
                    onClick={handleUserClick}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography className={classes.titleText} component="div" variant="h6" noWrap>
                        {data.name}
                      </Typography>
                      {data.role && <RoleBadge text={data.role} />}
                    </Box>
                  </CardActionArea>
                </Box>
              </Box>
            </HoverPopup>
          </Grid>
          <Grid item>
            <Box ml={2}>
              <Typography component="p" noWrap variant={showSimple ? 'body2' : 'body1'}>
                {fromNow}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardActions>
      <CardActions
        className={classes.actions}
        // eslint-disable-next-line
        // @ts-ignore
        disableactionspacing="true"
      >
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
              {thanked ? (
                <img src={thankedSvg} className={classes.actionIcon} alt="thanked" />
              ) : (
                <img src={thanksSvg} className={classes.actionIcon} alt="thanks" />
              )}
            </IconButton>
            <strong>{thanksCount}</strong>
          </Typography>
          <Typography component="p" variant="subtitle1" className={classes.actionIcons}>
            <img src={commentSvg} className={classes.actionIcon} alt="comment" />
            <strong>{commentCount}</strong>
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

      {showComments && (
        <ViewNotes
          isPastClassFlashcard={
            pastClassIds.includes(data.classId) && data.typeId === FeedTypes.flashcards.id
          }
          isFromList
          feedId={data.feedId}
          postId={data.postId}
          typeId={data.typeId}
          classId={data.classId}
          toolbarPrefix={toolbarPrefix}
          isQuestion={data.typeId === FeedTypes.question.id}
          isOwner={data.userId === currentUserId}
          hasBestAnswer={data.bestAnswer}
          isCurrent={isCurrent}
          initialComment={data.firstComment}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </Card>
  );
};

FeedItem.defaultProps = {
  showComments: true,
  showSimple: false
};

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect<{}, {}, Props>(mapStateToProps, null)(FeedItem);
