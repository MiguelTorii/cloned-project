// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
// import linkPost from '../assets/svg/ic_link_post.svg';

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
  // media: {
  //   height: 0,
  //   paddingTop: '56.25%' // 16:9
  // },
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
    padding: theme.spacing.unit
  },
  actions: {
    display: 'flex',
    padding: 0
  },
  avatar: {
    backgroundColor: red[500]
  },
  stats: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  stat: {
    margin: theme.spacing.unit
  }
});

type Props = {
  classes: Object,
  userId: number,
  feedId: number,
  handleShareClick: Function
};

type State = {
  moreAnchorEl?: string
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
    const { userId, feedId, handleShareClick } = this.props;
    handleShareClick({ userId, feedId });
  };

  render() {
    const { classes } = this.props;
    const { moreAnchorEl } = this.state;
    const isMenuOpen = Boolean(moreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={moreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <BookmarkBorderIcon />
          </IconButton>
          <p>Bookmark</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <ReportIcon />
          </IconButton>
          <p>Report</p>
        </MenuItem>
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
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton onClick={this.handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <div className={classes.title}>
              <Typography component="p" variant="subtitle2" noWrap>
                Camilo Rios
              </Typography>
              <Typography component="p" variant="caption" noWrap>
                <strong>•</strong>
              </Typography>
              <Typography component="p" variant="caption" noWrap>
                September 14, 2016
              </Typography>
            </div>
          }
          subheader={
            <Typography component="p" noWrap>
              Algebra
            </Typography>
          }
        />
        {/* <CardMedia
          className={classes.media}
          image={linkPost}
          title="Paella dish"
        /> */}
        <CardContent className={classes.content}>
          <Typography component="p" variant="subtitle2" noWrap>
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
          <Typography component="p" noWrap>
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Share" onClick={this.handleShareClick}>
            <ShareIcon />
          </IconButton>
          <div className={classes.stats}>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>0</strong> questions
            </Typography>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>10</strong> thanks
            </Typography>
            <Typography
              component="p"
              variant="caption"
              className={classes.stat}
            >
              <strong>20</strong> views
            </Typography>
          </div>
        </CardActions>
        {renderMenu}
      </Card>
    );
  }
}

export default withStyles(styles)(FeedItem);
