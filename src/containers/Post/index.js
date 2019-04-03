// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import CircularProgress from '@material-ui/core/CircularProgress';
import type { State as StoreState } from '../../types/state';
// import type { FeedState } from '../../reducers/feed';
import PostItem from '../../components/PostItem';
// import * as shareActions from '../actions/share';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    maxHeight: 'inherit'
  },
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  }
});

type ProvidedProps = {
  classes: Object
};

type Props = {
  classes: Object
  // feed: FeedState,
  // feedId: number
};

type State = {};

class Post extends React.PureComponent<ProvidedProps & Props, State> {
  render() {
    const {
      classes
      // feed: { items },
      // feedId
    } = this.props;
    // const feedItem = items.find(o => Number(o.feed_id) === Number(feedId));

    // if (feedItem)
    //   return (
    //     <div className={classes.loader}>
    //       <CircularProgress />
    //     </div>
    //   );

    // const {
    //   best_answer: bestAnswer = false,
    //   body = '',
    //   bookmarked = false,
    //   class_id: classId = 0,
    //   classroom_name: classroomName,
    //   created = new Date(),
    //   deck = [],
    //   full_note_url: fullNoteUrl = '',
    //   grade = 0,
    //   in_study_circle: inStudyCircle = false,
    //   name = '',
    //   note = '',
    //   note_url: noteUrl = '',
    //   post_id: postId = 0,
    //   post_info: postInfo
    // } = feedItem;
    // console.log(postInfo);

    //   best_answer: false
    //   body: ""
    //   bookmarked: false
    //   class_id: 67
    //   classroom_name: "Algebra 2"
    //   created: "2019-01-18T23:35:01Z"
    //   deck: Array(0)
    //   length: 0
    //   __proto__: Array(0)
    //   feed_id: 997
    //   full_note_url: ""
    //   grade: 8
    //   in_study_circle: false
    //   name: "James M"
    //   note: ""
    //   note_url: ""
    //   post_id: 217
    //   post_info:
    //   date: "2019-01-18T23:35:01Z"
    //   feed_id: 997
    //   post_id: 217
    //   questions_count: 0
    //   thanks_count: 0
    //   user_id: 1333
    //   view_count: 0
    //   __proto__: Object
    //   rank: 1
    //   reports: 0
    //   school: "BRIGGS CHANEY MIDDLE"
    //   subject: "Math"
    //   thanked: false
    //   title: "Notes"
    //   type_id: 5
    //   uri: "www.google.com"
    //   user_id: 1333
    //   user_profile_url: ""
    return (
      <div className={classes.root}>
        <PostItem />
      </div>
    );
  }
}

const mapStateToProps = ({ feed }: StoreState): {} => ({
  feed
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      //   closeShareDialog: shareActions.closeShareDialog
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Post));
