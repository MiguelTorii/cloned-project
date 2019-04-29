// @flow
import React, { Fragment } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import PostItemAddComent from './PostItemAddComment';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import Markdown from './Markdown';

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.unit * 2
  },
  reply: {
    marginLeft: theme.spacing.unit * 4
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit * 2
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  created: {
    paddingLeft: theme.spacing.unit
  },
  markdown: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily
  },
  progress: {
    width: '100%'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  thanks: {
    marginLeft: theme.spacing.unit
  }
  // icon: {
  //   marginLeft: theme.spacing.unit * 2
  // }
});

type Props = {
  classes: Object,
  id: number,
  firstName: string,
  lastName: string,
  profileImageUrl: string,
  created: string,
  comment: string,
  thanksCount: number,
  thanked: boolean,
  rootCommentId: number,
  isReply?: boolean,
  isLoading?: boolean,
  onPostComment: Function
};

type State = {
  showAddComment: boolean
};

class PostItemComment extends React.PureComponent<Props, State> {
  static defaultProps = {
    isReply: false,
    isLoading: false
  };

  state = {
    showAddComment: false
  };

  handlePostComment = ({ comment }) => {
    const { id, rootCommentId, onPostComment } = this.props;
    onPostComment({ comment, rootCommentId, parentCommentId: id });
  };

  handleShowAddComment = () => {
    this.setState(({ showAddComment }) => ({
      showAddComment: !showAddComment
    }));
  };

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImageUrl,
      created,
      comment,
      thanksCount,
      thanked,
      isReply,
      isLoading
    } = this.props;
    const { showAddComment } = this.state;
    const date = moment(created);
    const name = `${firstName} ${lastName}.`;
    const initials = name !== '' ? (name.match(/\b(\w)/g) || []).join('') : '';
    const fromNow = date ? date.fromNow() : '';

    return (
      <Fragment>
        <div className={cx(classes.container, isReply && classes.reply)}>
          <Avatar src={profileImageUrl}>{initials}</Avatar>
          <div className={classes.info}>
            <div className={classes.header}>
              <Typography component="p" variant="subtitle2" noWrap>
                {name}
              </Typography>
              <Typography
                component="p"
                variant="caption"
                noWrap
                className={classes.created}
              >
                {fromNow}
              </Typography>
            </div>
            {isLoading && (
              <div className={classes.progress}>
                <LinearProgress variant="query" />
              </div>
            )}
            <div className={classes.markdown}>
              <span dangerouslySetInnerHTML={{ __html: comment }} />
              {/* <Markdown>{comment}</Markdown> */}
            </div>
            <div className={classes.actions}>
              <IconButton>
                {thanked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              </IconButton>
              <Typography
                component="p"
                variant="subtitle2"
                className={classes.thanks}
              >
                {thanksCount}
              </Typography>
              <Button color="primary" onClick={this.handleShowAddComment}>
                Reply
              </Button>
              <Button color="primary">Report</Button>
            </div>
            {/* <Button>
            See 10 Answers
            <ExpandMoreIcon className={classes.icon} />
          </Button> */}
          </div>
        </div>
        <Collapse in={showAddComment}>
          <PostItemAddComent
            isReply={isReply}
            onPostComment={this.handlePostComment}
            onCancelComment={this.handleShowAddComment}
          />
        </Collapse>
      </Fragment>
    );
  }
}

export default withStyles(styles)(PostItemComment);
