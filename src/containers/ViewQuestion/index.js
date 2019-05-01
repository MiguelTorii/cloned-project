// @flow

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { UserState } from '../../reducers/user';
import type { State as StoreState } from '../../types/state';
import type { Question } from '../../types/models';
import { getQuestion } from '../../api/posts';
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
  questionId: number
};

type State = {
  question: ?Question
};

class ViewQuestion extends React.PureComponent<Props, State> {
  state = {
    question: null
  };

  componentDidMount = async () => {
    const {
      user: {
        data: { userId }
      },
      questionId
    } = this.props;
    const question = await getQuestion({ userId, questionId });
    this.setState({ question });
  };

  render() {
    const {
      classes,
      user: {
        data: { userId }
      }
    } = this.props;
    const { question } = this.state;
    console.log(question);
    if (!question)
      return (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      );
    const {
      feedId,
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
    } = question;

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
            isMarkdown
          />
          <PostItemActions
            feedId={feedId}
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
)(withStyles(styles)(ViewQuestion));
