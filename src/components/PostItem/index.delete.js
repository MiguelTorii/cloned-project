// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PostItemLink from './post-item-link';
import PostItemAddComment from './PostItemAddComment';
import PostItemComment from './PostItemComment';

const styles = theme => ({
  container: {
    maxHeight: 'inherit',
    display: 'flex',
    padding: theme.spacing.unit
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    overflowY: 'auto'
  },
  postInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 100,
    padding: theme.spacing.unit
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit * 2
  },
  body: {}
});

type Props = {
  classes: Object
};

type State = {};

class PostItem extends React.PureComponent<Props, State> {
  renderPostItem = () => {
    const url = 'https://circleinapp.com';
    return <PostItemLink url={url} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Paper className={classes.root} elevation={0}>
          <div className={classes.body}>
            <div className={classes.postInfo}>
              <Avatar className={classes.bigAvatar}>CR</Avatar>
              <div className={classes.userInfo}>
                <Typography component="p" variant="subtitle2" noWrap>
                  James M.
                </Typography>
                <Typography component="p" variant="caption" noWrap>
                  Algebra 2
                </Typography>
                <Typography component="p" variant="caption" noWrap>
                  25 days ago
                </Typography>
              </div>
            </div>
            <Typography component="p" variant="h6" noWrap>
              The Post Title
            </Typography>
            <Typography component="p" variant="body1" noWrap>
              The post body
            </Typography>
            {this.renderPostItem()}
            <div className={classes.comments}>
              <PostItemAddComment />
              <PostItemComment />
              <PostItemComment />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(PostItem);
