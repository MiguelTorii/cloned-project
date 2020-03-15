// @flow
import React from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Chip from '@material-ui/core/Chip';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CreateIcon from '@material-ui/icons/Create';
import Image from "react-graceful-image";
import TutorBadge from 'components/TutorBadge'
import linkPost from '../../assets/svg/ic_link_post.svg';
import flashcardPost from '../../assets/svg/ic_flashcard_post.svg';
import questionPost from '../../assets/svg/ic_question_post.svg';
// import bronze from '../../assets/svg/rank_bronze.svg';
// import silver from '../../assets/svg/rank_silver.svg';
// import gold from '../../assets/svg/rank_gold.svg';
// import platinum from '../../assets/svg/rank_platinum.svg';
// import diamond from '../../assets/svg/rank_diamond.svg';
// import master from '../../assets/svg/rank_master.svg';
import type { FeedItem as Item } from '../../types/models';

// const ranks = [bronze, silver, gold, platinum, diamond, master];

const styles = theme => ({
  card: {
    // margin: theme.spacing(2)
    // borderWidth: 100,
    // borderColor: 'black',
    // borderStyle: 'solid'
  },
  root: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: grey[200],
    borderBottomStyle: 'solid'
  },
  media: {
    height: 10
    // paddingTop: '56.25%' // 16:9
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
    wordBreak: 'break-word'
  },
  content: {
    padding: theme.spacing(),
    display: 'flex',
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
    padding: 0
  },
  stats: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  stat: {
    margin: theme.spacing()
  },
  rank: {
    width: 15
  },
  notePost: {
    objectFit: 'cover',
    borderRadius: 10,
    width: 75,
    height: 75
  },
  numberOfCardsStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    height: 75,
    width: 77,
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.25)',
    transform: 'translate(-1px, -77px)',
    borderRadius: 10,
  },
  imagePost: {
    minHeight: 75,
    maxHeight: 75,
    minWidth: 75,
    maxWidth: 75
  },
  flashCardsImage: {
    display: 'flex',
    flexDirection: 'column'
  },
  deckCount: {
    width: '100%',
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
    margin: theme.spacing()
  },
  label: {
    fontSize: 10
  },
  bookmarked: {
    color: green[500]
  }
});

type Props = {
  classes: Object,
  userId: string,
  data: Item,
  handleShareClick: Function,
  pushTo: Function,
  onPostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function,
  newClassesDisabled: boolean,
  onUserClick: Function
};

type State = {
  moreAnchorEl: ?string
};

class FeedItem extends React.PureComponent<Props, State> {
  state = {
    moreAnchorEl: null
  };
  
  // eslint-disable-next-line no-undef
  el: ?HTMLDivElement;

  handleMenuOpen = event => {
    this.setState({ moreAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ moreAnchorEl: null });
  };

  handleShareClick = () => {
    const {
      data: { feedId },
      handleShareClick
    } = this.props;
    handleShareClick({ feedId });
  };

  handleBookmark = () => {
    const {
      data: { feedId, bookmarked },
      onBookmark
    } = this.props;
    this.handleMenuClose();
    onBookmark({ feedId, bookmarked });
  };

  handleReport = () => {
    const {
      data: { feedId, userId },
      onReport
    } = this.props;
    this.handleMenuClose();
    onReport({ feedId, ownerId: userId });
  };

  handleDelete = () => {
    const {
      data: { feedId },
      onDelete
    } = this.props;
    this.handleMenuClose();
    onDelete({ feedId });
  };

  handleEdit = () => {
    const {
      data: { postId, typeId },
      pushTo
    } = this.props;

    this.handleMenuClose();
    if (typeId === 3) pushTo(`/edit/flashcards/${postId}`)
    if (typeId === 4) pushTo(`/edit/notes/${postId}`)
    if (typeId === 5) pushTo(`/edit/sharelink/${postId}`)
    if (typeId === 6) pushTo(`/edit/question/${postId}`)
  };

  handleUserClick = () => {
    const {
      data: { userId },
      onUserClick
    } = this.props;
    onUserClick({ userId });
  };

  handleDescription = (typeId, body) => {
    if (typeId === 6) return '';

    if (body.length < 100) return body;

    return `${body.substring(0, 99)}...`;
  };

  renderImage = () => {
    const { classes, data } = this.props;
    const { numberOfNotes } = data
    switch (data.typeId) {
    case 3:
      return (
        <div className={classes.flashCardsImage}>
          <img
            src={flashcardPost}
            className={classes.type}
            alt="Flascarhds"
          />
          <div className={classes.deckCount}>
            {`${data.deck.length} Cards`}
          </div>
        </div>
      );
    case 4:
      return (
        <div>
          <Image
            noLazyLoad
            className={classes.notePost}
            src={data.noteUrl}
          />
          {numberOfNotes > 1 && <div className={classes.numberOfCardsStyle}>+{numberOfNotes-1}</div>}
        </div>
      )
    case 5:
      return <img src={linkPost} className={classes.imagePost} alt="Link" />;
    case 6:
      return (
        <img
          src={questionPost}
          className={classes.imagePost}
          alt="Question"
        />
      );
    default:
      return null;
    }
  };

  render() {
    const { newClassesDisabled, classes, userId, data, onPostClick } = this.props;
    const { moreAnchorEl } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const initials =
      data.name !== '' ? (data.name.match(/\b(\w)/g) || []).join('') : '';
    const date = moment(data.created);
    const fromNow = date ? date.fromNow() : '';
    const ownerId = data.userId;

    const description = this.handleDescription(data.typeId, data.body);

    const renderMenu = (
      <Menu
        disableAutoFocusItem
        anchorEl={moreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleBookmark}>
          <ListItemIcon color="inherit">
            {data.bookmarked ? (
              <BookmarkIcon className={classes.bookmarked} />
            ) : (
              <BookmarkBorderIcon />
            )}
          </ListItemIcon>
          <ListItemText inset primary="Bookmark" />
        </MenuItem>
        {userId !== ownerId ? (
          <MenuItem onClick={this.handleReport}>
            <ListItemIcon color="inherit">
              <ReportIcon />
            </ListItemIcon>
            <ListItemText inset primary="Report" />
          </MenuItem>
        ) : (
          <div>
            <MenuItem onClick={this.handleEdit}>
              <ListItemIcon color="inherit">
                <CreateIcon />
              </ListItemIcon>
              <ListItemText inset primary="Edit" />
            </MenuItem>
            <MenuItem onClick={this.handleDelete}>
              <ListItemIcon color="inherit">
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText inset primary="Delete" />
            </MenuItem>
          </div>
        )}
      </Menu>
    );

    return (
      <div
        ref={node => {
          this.el = node;
        }}
      >
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
                onClick={this.handleUserClick}
              >
                <Avatar aria-label="Recipe" src={data.userProfileUrl}>
                  {initials}
                </Avatar>
              </ButtonBase>
            }
            action={
              <IconButton onClick={this.handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <CardActionArea 
                classes={{
                  focusHighlight: classes.cardHighlight
                }}
                onClick={this.handleUserClick}
              >
                <div className={classes.title}>
                  <Typography component="div" variant="h6" noWrap>
                    {data.name}
                    {/* <img
                      src={ranks[data.rank - 1]}
                      alt="Rank"
                      className={classes.rank}
                    /> */}
                    {data.roleId === 2 && ( 
                      <TutorBadge text='Tutor' />
                    )} 
                  </Typography>
                </div>
              </CardActionArea>
            }
            subheader={
              <CardActionArea disabled>
                <div style={{ display: 'flex', alignItems: 'center', color: '#e9ecef' }}>
                  {newClassesDisabled && <Typography component="p" noWrap>
                    {data.courseDisplayName}
                  </Typography>}
                  {newClassesDisabled && <Typography
                    component="p"
                    noWrap
                    style={{ marginRight: 5, marginLeft: 5 }}
                  >
                    <strong>•</strong>
                  </Typography>}
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
                {data.title}
              </Typography>
            </CardContent>
            <CardContent className={classes.content}>
              <Typography className={classes.description} component="p" variant="h6">
                {description}
              </Typography>
              <span />
              {this.renderImage()}
            </CardContent>
            <CardContent className={classes.tags}>
              {data.tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={`#${tag.name}`}
                  className={classes.chip}
                  classes={{ label: classes.label }}
                />
              ))}
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.actions} disableactionspacing='true'>
            <IconButton aria-label="Share" onClick={this.handleShareClick}>
              <ShareIcon />
            </IconButton>
            <IconButton aria-label="Bookmark" onClick={this.handleBookmark}>
              {data.bookmarked ? (
                <BookmarkIcon className={classes.bookmarked} />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <div className={classes.stats}>
              <Typography
                component="p"
                variant="subtitle1"
                className={classes.stat}
              >
                <strong>{data.postInfo.questionsCount}</strong>{' '}
                {data.typeId === 6 ? 'answers' : 'comments'}
              </Typography>
              <Typography
                component="p"
                variant="subtitle1"
                className={classes.stat}
              >
                <strong>{data.postInfo.thanksCount}</strong> thanks
              </Typography>
              <Typography
                component="p"
                variant="subtitle1"
                className={classes.stat}
              >
                <strong>{data.postInfo.viewCount}</strong> views
              </Typography>
            </div>
          </CardActions>
          {renderMenu}
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(FeedItem);
