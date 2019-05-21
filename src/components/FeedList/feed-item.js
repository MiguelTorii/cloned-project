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
import grey from '@material-ui/core/colors/grey';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import linkPost from '../../assets/svg/ic_link_post.svg';
import flashcardPost from '../../assets/svg/ic_flashcard_post.svg';
import questionPost from '../../assets/svg/ic_question_post.svg';
import bronze from '../../assets/svg/rank_bronze.svg';
import silver from '../../assets/svg/rank_silver.svg';
import gold from '../../assets/svg/rank_gold.svg';
import platinum from '../../assets/svg/rank_platinum.svg';
import diamond from '../../assets/svg/rank_diamond.svg';
import master from '../../assets/svg/rank_master.svg';
import type { FeedItem as Item } from '../../types/models';

const ranks = [bronze, silver, gold, platinum, diamond, master];

const styles = theme => ({
  card: {
    // margin: theme.spacing.unit * 2
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
    padding: theme.spacing.unit
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    '& > :first-child': {
      marginRight: theme.spacing.unit / 2
    },
    '& > :last-child': {
      marginLeft: theme.spacing.unit / 2
    }
  },
  content: {
    padding: theme.spacing.unit,
    display: 'flex',
    '& > :nth-child(2)': {
      flex: 1
    }
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
    margin: theme.spacing.unit
  },
  rank: {
    width: 15
  },
  notePost: {
    minHeight: 75,
    maxHeight: 75,
    minWidth: 75,
    maxWidth: 75
  },
  imagePost: {
    width: 75,
    height: 75
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
  }
});

type Props = {
  classes: Object,
  userId: string,
  data: Item,
  handleShareClick: Function,
  handlePostClick: Function,
  onBookmark: Function,
  onReport: Function,
  onDelete: Function
};

type State = {
  moreAnchorEl: ?string
};

class FeedItem extends React.PureComponent<Props, State> {
  state = {
    moreAnchorEl: null
  };

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

  renderImage = () => {
    const { classes, data } = this.props;
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
          <div
            className={classes.notePost}
            style={{
              background: `url(${data.noteUrl})`,
              backgroundSize: 'cover',
              borderRadius: 10
            }}
          />
        );
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
    const { classes, userId, data, handlePostClick } = this.props;
    const { moreAnchorEl } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);
    const initials =
      data.name !== '' ? (data.name.match(/\b(\w)/g) || []).join('') : '';
    const date = moment(data.created);
    const fromNow = date ? date.fromNow() : '';
    const ownerId = data.userId;

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
            {data.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
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
          <MenuItem onClick={this.handleDelete}>
            <ListItemIcon color="inherit">
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    );

    return (
      <Card
        className={classes.card}
        elevation={0}
        classes={{ root: classes.root }}
      >
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar aria-label="Recipe" src={data.userProfileUrl}>
              {initials}
            </Avatar>
          }
          action={
            <IconButton onClick={this.handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <CardActionArea>
              <div className={classes.title}>
                <Typography component="p" variant="subtitle2" noWrap>
                  {data.name}{' '}
                  <img
                    src={ranks[data.rank - 1]}
                    alt="Rank"
                    className={classes.rank}
                  />
                </Typography>
                <Typography component="p" variant="caption" noWrap>
                  <strong>•</strong>
                </Typography>
                <Typography component="p" variant="caption" noWrap>
                  {fromNow}
                </Typography>
              </div>
            </CardActionArea>
          }
          subheader={
            <CardActionArea>
              <Typography component="p" noWrap>
                {data.classroomName}
              </Typography>
            </CardActionArea>
          }
        />
        <CardActionArea onClick={handlePostClick(data.typeId, data.postId)}>
          <CardContent className={classes.content}>
            <Typography
              component="p"
              variant="subtitle2"
              style={{ maxWidth: 200 }}
              noWrap
            >
              {data.title}
            </Typography>
            <span />
            {this.renderImage()}
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Share" onClick={this.handleShareClick}>
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="Bookmark" onClick={this.handleBookmark}>
            {data.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <div className={classes.stats}>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>{data.postInfo.questionsCount}</strong> questions
            </Typography>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>{data.postInfo.thanksCount}</strong> thanks
            </Typography>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>{data.postInfo.viewCount}</strong> views
            </Typography>
          </div>
        </CardActions>
        {renderMenu}
      </Card>
    );
  }
}

export default withStyles(styles)(FeedItem);
