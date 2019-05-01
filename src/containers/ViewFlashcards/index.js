// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Flashcards } from '../../types/models';
import { getFlashcards } from '../../api/posts';
import PostItem from '../../components/PostItem';
import PostItemHeader from '../../components/PostItem/PostItemHeader';
import PostItemActions from '../PostItemActions';
import PostComments from '../PostComments';

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

type Props = {
  classes: Object,
  user: UserState,
  flashcardId: number
};

type State = {
  flashcards: ?Flashcards
};

class ViewFlashcards extends React.PureComponent<Props, State> {
  state = {
    flashcards: null
  };

  componentDidMount = async () => {
    const {
      user: {
        data: { userId }
      },
      flashcardId
    } = this.props;
    const flashcards = await getFlashcards({ userId, flashcardId });
    this.setState({ flashcards });
  };

  render() {
    const { classes } = this.props;
    const { flashcards } = this.state;
    console.log(flashcards);
    if (!flashcards)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    const {
      userId,
      postId,
      typeId,
      name,
      userProfileUrl,
      classroomName,
      created,
      body,
      title,
      thanked,
      inStudyCircle,
      postInfo: { questionsCount, thanksCount, viewCount }
    } = flashcards;

    return (
      <div className={classes.root}>
        <PostItem>
          <PostItemHeader
            name={name}
            userProfileUrl={userProfileUrl}
            classroomName={classroomName}
            created={created}
            body={body}
            title={title}
          />
          <PostItemActions
            thanked={thanked}
            inStudyCircle={inStudyCircle}
            questionsCount={questionsCount}
            thanksCount={thanksCount}
            viewCount={viewCount}
          />
          <PostComments userId={userId} postId={postId} typeId={typeId} />
        </PostItem>
      </div>
    );
  }
}

const mapStateToProps = ({ user }: StoreState): {} => ({
  user
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(ViewFlashcards));
